import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
// Widoczność UI nie zastępuje autoryzacji na serwerze.
@Directive({ selector: '[appPermission]' })
export class PermissionDirective {
  readonly appPermission = input(false);
  // TemplateRef to przepis na fragment HTML ukryty pod *appPermission.
  private readonly template = inject(TemplateRef<unknown>);
  // ViewContainerRef wskazuje miejsce, w którym Angular może utworzyć/usunąć ten widok.
  private readonly container = inject(ViewContainerRef);
  private visible = false;
  constructor() {
    // To efekt uboczny: synchronizujemy wejście dyrektywy z imperatywnym API widoków.
    // Zmienna visible chroni przed ponownym tworzeniem tego samego widoku.
    effect(() => {
      const allowed = this.appPermission();
      if (allowed === this.visible) return;
      this.container.clear();
      if (allowed) this.container.createEmbeddedView(this.template);
      this.visible = allowed;
    });
  }
}
