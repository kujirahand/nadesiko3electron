package main

import (
	"archive/zip"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

type InfoJson struct {
	Url      string `json:"url"`
	FileName string `json:"filename"`
	Count    int    `json:"count"`
}

func download(url string, filePath string) error {
	// HTTP GETリクエストを送信してファイルをダウンロード
	fmt.Printf("download: %s\n", filePath)
	response, err := http.Get(url)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	// レスポンスのステータスコードを確認
	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("ファイルのダウンロードに失敗しました: %s", response.Status)
	}

	// ファイルを作成または上書きして、ダウンロードデータを書き込む
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.Copy(file, response.Body)
	if err != nil {
		return err
	}

	return nil
}

func readInfoJson() (*InfoJson, error) {
	// "info.json"を読む
	text, err := os.ReadFile("info.json")
	if err != nil {
		fmt.Println("Error:", err)
		return nil, err
	}
	fmt.Println(string(text))
	// JSON文字列を構造体にパース
	var info InfoJson
	if err := json.Unmarshal([]byte(text), &info); err != nil {
		fmt.Println("JSONパースエラー:", err)
		return nil, err
	}
	return &info, nil
}

// ungzip 関数: GZip形式のファイルを解凍して指定したファイルに保存
func ungzip(gzfile, savefile string) error {
	// GZipファイルを開く
	gzippedFile, err := os.Open(gzfile)
	if err != nil {
		return err
	}
	defer gzippedFile.Close()

	// GZipリーダーを作成
	gzipReader, err := gzip.NewReader(gzippedFile)
	if err != nil {
		return err
	}
	defer gzipReader.Close()

	// 解凍して保存
	outputFile, err := os.Create(savefile)
	if err != nil {
		return err
	}
	defer outputFile.Close()

	_, err = io.Copy(outputFile, gzipReader)
	if err != nil {
		return err
	}

	return nil
}

func unzip(zipfile, destDir string) error {
	// ZIPファイルを開く
	r, err := zip.OpenReader(zipfile)
	if err != nil {
		return err
	}
	defer r.Close()

	// デストディレクトリが存在しない場合は作成
	if err := os.MkdirAll(destDir, os.ModePerm); err != nil {
		return err
	}

	// ZIPファイル内のファイルを展開
	for _, f := range r.File {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer rc.Close()

		// 出力ファイルを作成
		outFile, err := os.Create(filepath.Join(destDir, f.Name))
		if err != nil {
			return err
		}
		defer outFile.Close()

		// ファイルをコピー
		_, err = io.Copy(outFile, rc)
		if err != nil {
			return err
		}
	}

	return nil
}

// FileCopy 関数: コピー元ファイルからコピー先ファイルへのファイルコピー
func FileCopy(sourceFile, destinationFile string) error {
	// コピー元ファイルの内容を読み取り
	data, err := os.ReadFile(sourceFile)
	if err != nil {
		return err
	}

	// コピー先ファイルに書き込み
	err = os.WriteFile(destinationFile, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func main() {
	// "info.json"を読む
	info, err := readInfoJson()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	executablePath, err := os.Executable()
	if err != nil {
		fmt.Println("実行ファイルのパスを取得できませんでした:", err)
		return
	}
	fmt.Printf("executablePath: %s\n", executablePath)
	rootDir := filepath.Dir(executablePath)
	// テンポラリフォルダを作る
	outDir := filepath.Join(rootDir, "temp")
	if _, err := os.Stat(outDir); os.IsNotExist(err) {
		os.MkdirAll(outDir, 0755)
	}
	// ファイルをダウンロードする
	for i := 0; i < info.Count; i++ {
		url := fmt.Sprintf("%s/parts_%s_%02d.bin.gz", info.Url, info.FileName, i)
		saveFileGz := fmt.Sprintf("%s/parts_%s_%02d.bin.gz", outDir, info.FileName, i)
		saveFileBin := fmt.Sprintf("%s/parts_%s_%02d.bin", outDir, info.FileName, i)
		fmt.Printf("+ url from: %s\n", url)
		fmt.Printf("| save to : %s\n", filepath.Base(saveFileGz))
		if err := download(url, saveFileGz); err != nil {
			fmt.Println("Error:", err)
			return
		}
		if err := ungzip(saveFileGz, saveFileBin); err != nil {
			fmt.Println("Ungzip Error:", err)
			fmt.Println("ta:", err)
			return
		}
	}
	// ファイルを結合する
	outFile := fmt.Sprintf("%s/%s", outDir, info.FileName)
	outFileHandle, err := os.Create(outFile)
	if err != nil {
		fmt.Println("ファイルを作成または開けませんでした:", err)
		return
	}
	defer outFileHandle.Close()
	// 分割ファイルを結合
	for i := 0; i < info.Count; i++ {
		partFile := fmt.Sprintf("%s/parts_%s_%02d.bin", outDir, info.FileName, i)
		inFileHandle, err := os.Open(partFile)
		if err != nil {
			fmt.Printf("ファイル%sを開けませんでした: %v\n", partFile, err)
			continue
		}
		defer inFileHandle.Close()
		// 分割ファイルの内容を結合ファイルに書き込む
		_, err = io.Copy(outFileHandle, inFileHandle)
		if err != nil {
			fmt.Println("ファイルの結合に失敗しました:", err)
			return
		}
	}
	fmt.Println("ファイルの結合が完了しました")
	fmt.Printf("path: %s\n", outFile)
	ext := filepath.Ext(outFile)
	if ext == ".zip" {
		// 結合したZIPファイルを解凍する
		unzipDir := fmt.Sprintf("%s/%s", rootDir, info.FileName[:len(info.FileName)-len(filepath.Ext(info.FileName))])
		if err := unzip(outFile, unzipDir); err != nil {
			fmt.Println("ZIPファイルの解凍に失敗しました:", err)
			return
		}
		fmt.Println("ZIPファイルの解凍が完了しました")
		fmt.Printf("output directory: %s\n", unzipDir)
	} else {
		targetFile := fmt.Sprintf("%s/%s", rootDir, info.FileName)
		FileCopy(outFile, targetFile)
		fmt.Println("ファイルをコピーしました。")
		fmt.Printf("path: %s\n", targetFile)
	}
}
