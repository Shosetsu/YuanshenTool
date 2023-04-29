import { Directive, ElementRef, Input } from '@angular/core';
import { SystemService } from '../core/system.service';

/**
 * 自动补充文本支持指令
 */
@Directive({ selector: '[libTextId]' })
export class TextDirective {
  /**
   * 初始设置时更新节点文本内容
   */
  @Input() set libTextId(libTextId: string) {
    this.el.nativeElement.innerText = this.system.langText[libTextId];
  }

  /**
   * 构造器
   *
   * @param el 当前节点
   * @param system 系统服务
   */
  constructor(
    private el: ElementRef<HTMLElement>,
    private system: SystemService
  ) {}
}
