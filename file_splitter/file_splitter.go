package main

import (
	"compress/gzip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
)

func main() {
	// 設定
	MB := 1024 * 1024
	// ファイルを分割するサイズ（25MB）
	splitSize := 25 * MB

	// コマンドライン引数から入力ファイル名を受け取ります
	args := os.Args
	if len(args) < 2 {
		fmt.Println("[Usage] file_splitter <input> <size:MB>")
		return
	}
	inputFilePath := args[1]
	fmt.Printf("Input file: %s\n", inputFilePath)
	if len(args) >= 3 {
		sz, errC := strconv.Atoi(args[2])
		if errC == nil {
			splitSize = MB * sz
		}
	}
	fmt.Printf("Split size: %d MB\n", splitSize/MB)

	// 入力ファイルが存在するか確認
	_, err := os.Stat(inputFilePath)
	if err != nil {
		fmt.Println("Input file not found:", err)
		return
	}

	// 出力ディレクトリのパスを指定します
	outputDirectory := "./output"
	// 出力ディレクトリが存在しない場合は作成
	if _, err := os.Stat(outputDirectory); os.IsNotExist(err) {
		os.MkdirAll(outputDirectory, 0755)
	}

	// 入力ファイルを開く
	inputFile, err := os.Open(inputFilePath)
	if err != nil {
		fmt.Println("Error opening input file:", err)
		return
	}
	defer inputFile.Close()

	// ファイルサイズを表示
	fileInfo, _ := inputFile.Stat()
	fileSize := fileInfo.Size()
	partsCount := fileSize / int64(splitSize)
	if fileSize%int64(splitSize) != 0 {
		partsCount++
	}
	fmt.Printf("File size: %d MB / %d files\n", fileSize/(1024*1024), partsCount)

	fileList := ""
	buffer := make([]byte, splitSize)
	for i := 0; i < int(partsCount); i++ {
		// 分割ファイルの名前を生成
		base := filepath.Base(inputFilePath)
		// base_name := base[:len(base)-len(ext)] // Remove extension
		baseName := fmt.Sprintf("parts_%s_%02d.bin", base, i)
		splitFileName := fmt.Sprintf("%s/%s", outputDirectory, baseName)
		fmt.Println("-", splitFileName)
		fileList += baseName + ".gz\n"

		// 分割ファイルを作成
		splitFile, err := os.Create(splitFileName)
		if err != nil {
			fmt.Println("Error creating split file:", err)
			return
		}
		defer splitFile.Close()

		// 分割サイズ分のデータを読み込み、分割ファイルに書き込み
		n, err := inputFile.Read(buffer)
		if err != nil && err != io.EOF {
			fmt.Println("Error reading input file:", err)
			return
		}
		_, err = splitFile.Write(buffer[:n])
		if err != nil {
			fmt.Println("Error writing to split file:", err)
			return
		}

		// 分割ファイルをgzip圧縮
		if errComp := compressGz(splitFileName, splitFileName+".gz"); errComp != nil {
			fmt.Println("ファイルの圧縮に失敗しました:", errComp)
			return
		}

		// gzip元のファイルを削除
		os.Remove(splitFileName)
	}
	listFile := fmt.Sprintf("%s/filelist.txt", outputDirectory)
	os.WriteFile(listFile, []byte(fileList), 0644)
	fmt.Println("File split successfully.")
}

// compressGz 関数: 指定した元ファイルをgzip圧縮して指定した出力ファイルに保存
func compressGz(sourceFile, compressedFile string) error {
	// 元ファイルを開く
	inputFile, err := os.Open(sourceFile)
	if err != nil {
		return err
	}
	defer inputFile.Close()

	// 出力ファイルを作成
	outputFile, err := os.Create(compressedFile)
	if err != nil {
		return err
	}
	defer outputFile.Close()

	// gzip.Writerを使用してファイルをgzip圧縮
	gzipWriter := gzip.NewWriter(outputFile)
	_, err = io.Copy(gzipWriter, inputFile)
	if err != nil {
		return err
	}

	// gzip圧縮を終了してクローズ
	err = gzipWriter.Close()
	if err != nil {
		return err
	}

	return nil
}
