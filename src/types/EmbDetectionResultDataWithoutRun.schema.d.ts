/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface EmbDetectionResultDataWithoutRun {
  id: number;
  runUuid: number;
  detectedFiles: EmbeddedFileData[];
  [k: string]: unknown;
}
export interface EmbeddedFileData {
  id: number;
  resultId: number;
  metadata: FileMetadataData;
  parentId: number | null;
  [k: string]: unknown;
}
export interface FileMetadataData {
  id: number;
  path: string;
  data: FileBodyData;
  created: string;
  modified: string;
  creator: string;
  modifier: string;
  [k: string]: unknown;
}
export interface FileBodyData {
  md5: string;
  size: number;
  kind: string;
  data?: string | null;
  [k: string]: unknown;
}
