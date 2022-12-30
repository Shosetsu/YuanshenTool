/**
 * 系统服务
 */
export class SystemService {
  /** 初始化完成标识 */
  isInit = false;

  /** 程序运行时文本 */
  langText!: Record<string, string>;

  /** 初始化过的程序 */
  loadedModules: Record<string, boolean> = {};
}
