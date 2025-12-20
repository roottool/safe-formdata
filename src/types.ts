/**
 * 禁止キー、重複キー、無効キーを表すissueコード
 */
export type ParseIssueCode =
  | 'invalid_key'
  | 'forbidden_key'
  | 'duplicate_key'

/**
 * パース中に検出された境界違反
 */
export interface ParseIssue {
  /** issue種別 */
  code: ParseIssueCode
  /** 人間が読める単独のメッセージ */
  message: string
  /** 常に空配列（構造推論を行わないため） */
  path: string[]
  /** 追加情報（オプション） */
  meta?: Record<string, unknown>
}

/**
 * パース結果
 * - issues が空でない場合、data は null
 * - 部分成功は許可されない
 */
export interface ParseResult<T = Record<string, string | File>> {
  /** パース成功時のデータ（Object.create(null)で作成） */
  data: T | null
  /** 検出された境界違反の配列 */
  issues: ParseIssue[]
}
