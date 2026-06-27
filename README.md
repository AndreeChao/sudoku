# 數獨 Sudoku

專為長輩設計的數獨網頁遊戲，支援 PWA 安裝至手機主畫面。

**線上遊玩：** https://sudoku-sage-one.vercel.app

## 功能

- 三種難度：普通 / 困難（預設）/ 專家
- 鉛筆模式：在格子內記錄候選數字，填入答案後自動清除同行/列/宮格的重複候選數字
- 衝突提示：同行/列/宮格若有重複答案，顯示紅色警告；重複候選數字顯示橘紅色
- 復原：支援最多 10 步 Undo
- 計時器 + 最快紀錄（每種難度分別儲存）
- 新局按鈕：隨時重新開始
- 適合觸控：按鈕 ≥ 60px，無 iOS 點擊延遲

## 技術

- React 19 + Vite 8
- PWA（vite-plugin-pwa），可離線使用
- Web Worker 背景生成謎題，不阻塞 UI
- Vitest + @testing-library/react（24 個測試）

## 本地開發

```bash
npm install
npm run dev      # 開發伺服器
npm test         # 執行測試
npm run build    # 打包
```
