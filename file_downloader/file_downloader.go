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
		fmt.Println("Ungzip error, could not open:", gzfile, err)
		return err
	}
	defer gzippedFile.Close()

	// GZipリーダーを作成
	gzipReader, err := gzip.NewReader(gzippedFile)
	if err != nil {
		fmt.Println("Ungzip error, could not read:", gzfile, err)
		return err
	}
	defer gzipReader.Close()

	// 解凍して保存
	outputFile, err := os.Create(savefile)
	if err != nil {
		fmt.Println("Ungzip error, could not create:", savefile, err)
		return err
	}
	defer outputFile.Close()

	_, err = io.Copy(outputFile, gzipReader)
	if err != nil {
		fmt.Println("Ungzip error, could not ungzip:", gzfile, err)
		return err
	}

	return nil
}

func unzip(zipfile, destDir string) error {
	// ZIPファイルを開く
	r, err := zip.OpenReader(zipfile)
	if err != nil {
		fmt.Println("ZIPファイルの読み込みに失敗しました:", err)
		return err
	}
	defer r.Close()

	// 保存ディレクトリが存在しない場合は作成
	if err := os.MkdirAll(destDir, os.ModePerm); err != nil {
		fmt.Println("保存ディレクトリの作成に失敗しました:", err)
		return err
	}

	// ZIPファイル内のファイルを展開
	for _, f := range r.File {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer rc.Close()
		fmt.Println("- ", f.Name)
		fi := f.FileInfo()

		// 出力ファイルを作成
		subdir := filepath.Dir(f.Name)
		// fmt.Println("-- subdir:", subdir)
		if subdir != "." && subdir != "" {
			target_dir := filepath.Join(destDir, subdir)
			if !fileExists(target_dir) {
				os.MkdirAll(target_dir, 0755)
			}
		}
		target_path := filepath.Join(destDir, f.Name)
		if fi.IsDir() {
			// ディレクトリなら何もしない
			continue
		}
		// ファイルなら保存
		outFile, err := os.Create(target_path)
		if err != nil {
			fmt.Println("ファイルの作成に失敗しました:", err)
			fmt.Println("path:", target_path)
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

func fileExists(filePath string) bool {
	_, err := os.Stat(filePath)
	return !os.IsNotExist(err)
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
	line := "=================================================="
	fmt.Println(line)
	fmt.Println("| File Downloader")
	fmt.Println(line)
	// "info.json"を読む
	info, err := readInfoJson()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println("URL:", info.Url)
	fmt.Println("File Name:", info.FileName)
	// check path
	executablePath, err := os.Executable()
	if err != nil {
		fmt.Println("実行ファイルのパスを取得できませんでした:", err)
		return
	}
	rootDir := filepath.Dir(executablePath)
	// テンポラリフォルダを作る
	outDir := filepath.Join(rootDir, "temp")
	if _, err := os.Stat(outDir); os.IsNotExist(err) {
		os.MkdirAll(outDir, 0755)
	}
	fmt.Println("Temp Directory:", outDir)
	// ファイルをダウンロードする
	for i := 0; i < info.Count; i++ {
		url := fmt.Sprintf("%s/parts_%s_%02d.bin.gz", info.Url, info.FileName, i)
		saveFileNameGz := fmt.Sprintf("parts_%s_%02d.bin.gz", info.FileName, i)
		saveFileGz := filepath.Join(outDir, saveFileNameGz)
		saveFileNameBin := fmt.Sprintf("parts_%s_%02d.bin", info.FileName, i)
		saveFileBin := filepath.Join(outDir, saveFileNameBin)
		if fileExists(saveFileGz) {
			fmt.Printf("- skip : %s\n", filepath.Base(saveFileGz))
		} else {
			fmt.Printf("- download : %s\n", filepath.Base(saveFileGz))
			if err := download(url, saveFileGz); err != nil {
				fmt.Println("Error:", err)
				return
			}
		}
		if err := ungzip(saveFileGz, saveFileBin); err != nil {
			fmt.Println("[Ungzip.Error]:", err)
			fmt.Println("- gz :", saveFileGz)
			fmt.Println("- bin:", saveFileBin)
			return
		} else {
			fmt.Printf("| Ungzip : %s\n", filepath.Base(saveFileBin))
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
		partName := fmt.Sprintf("parts_%s_%02d.bin", info.FileName, i)
		partFile := filepath.Join(outDir, partName)
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
	fmt.Println(line)
	fmt.Println("| ファイルの結合が完了しました!!")
	fmt.Printf("| path: %s\n", outFile)
	fmt.Println(line)
	ext := filepath.Ext(outFile)
	if ext == ".zip" {
		fmt.Println("| これからZIPファイルを解凍します。少々お待ちください。")
		// 結合したZIPファイルを解凍する
		unzipDir := filepath.Join(rootDir, fmt.Sprintf("%s", info.FileName[:len(info.FileName)-len(filepath.Ext(info.FileName))]))
		if err := unzip(outFile, unzipDir); err != nil {
			fmt.Println("ZIPファイルの解凍に失敗しました:", err)
			return
		}
		fmt.Println(line)
		fmt.Println("ZIPファイルの解凍が完了しました")
		fmt.Printf("output directory: %s\n", unzipDir)
		fmt.Println(line)
	} else {
		targetFile := filepath.Join(rootDir, info.FileName)
		FileCopy(outFile, targetFile)
		fmt.Println(line)
		fmt.Println("ファイルをコピーしました。")
		fmt.Printf("path: %s\n", targetFile)
		fmt.Println(line)
	}
}
