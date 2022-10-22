import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Vditor from 'vditor';
import { Article } from './article';
import { DialogService } from 'ng-devui/modal';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'ng-devui/loading';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  vditor!: Vditor;
  items: Article[] = [];
  editItemIndex: number = -1; // 索引或触发事件时进行保存操作
  minDate = new Date(new Date().setMonth(new Date().getMonth() - 2));
  maxDate = new Date(new Date().setMonth(new Date().getMonth()));
  tagList: any = [];

  toolbars: any[] = [
    "emoji", "headings", "bold", "italic", "strike", "link", "|", "list", "ordered-list", "check", "outdent", "indent", "|", "quote", "line", "code", "inline-code", "insert-before", "insert-after", "|", "upload", "record", "table", "|", "undo", "redo", "|", "fullscreen",
    {
      name: "more", toolbar: ["both", "code-theme", "content-theme", "export", "outline", "preview", "devtools", "info", "help",]
    }
  ];

  constructor(
    private dialogService: DialogService,
    public http: HttpClient,
    private loadingService: LoadingService,
    @Inject(DOCUMENT) private doc: any
  ) { }

  ngOnInit(): void {
    const results = this.loadingService.open();

    this.items = JSON.parse(window.localStorage.getItem('notes')!);
    this.items = this.items || [];

    this.toolbars.splice(this.toolbars.length - 1, 0, {
      name: "delete",
      tip: '删除',
      icon: '<svg t="1665653149398" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2807" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M341.312 85.312l64-85.312h213.376l64 85.312H960v85.376H64V85.312h277.312zM170.688 256h682.624v768H170.688V256zM256 341.312v597.376h512V341.312H256z m213.312 85.376v426.624H384V426.688h85.312z m170.688 0v426.624H554.688V426.688H640z" fill="#262626" p-id="2808"></path></svg>',
      click: () => {
        this.deleteArticle();
      }
    });

    this.vditor = new Vditor('vditor', {
      height: '100%',
      minHeight: 500,
      toolbarConfig: { pin: true },
      toolbar: this.toolbars,
      counter: { enable: true },
      cache: { enable: false },
      placeholder: '请输入此刻的想法...'
    });

    results.loadingInstance.close();

    setInterval(() => {
      this.syncToLS()
    }, 1000);
  }

  addArticle() {
    this.saveArticle();
    if (this.editItemIndex > -1 && this.items[this.editItemIndex].content.length === 0) {
      return
    }
    this.items.unshift({ "id": 0, "content": "", "title": "无标题", "star": false, "tags": [], "time": (new Date).toLocaleString() });
    this.editItemIndex = 0;
    this.tagList = [];
    this.vditor.setValue('');
  }

  deleteArticle() {
    const results = this.dialogService.open({
      id: 'dialog-service',
      width: '346px',
      maxHeight: '600px',
      title: '确定删除?',
      content: "确定删除该便签吗？删除后可在回收站内恢复",
      backdropCloseable: true,
      buttons: [
        {
          cssClass: 'danger',
          text: '删除',
          disabled: false,
          handler: ($event: Event) => {
            const loading = this.loadingService.open();
            this.items.splice(this.editItemIndex, 1); // 移除当前元素
            this.syncToLS();
            this.vditor.setValue('')
            this.tagList = [];
            this.editItemIndex = -1
            results.modalInstance.hide();
            loading.loadingInstance.close();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  syncToLS() {
    if (this.items && this.items.length > 0) {
      window.localStorage.setItem("notes", JSON.stringify(this.items.filter(item => item.content.trim() != '')));
    }
  }

  saveArticle() {
    if (this.editItemIndex > -1) {
      this.items[this.editItemIndex].content = this.vditor.getValue().trim();
      this.items[this.editItemIndex].title = this.items[this.editItemIndex].content.substring(0, 20) || '无标题';
      this.items[this.editItemIndex].tags = this.tagList;
    }
  }

  selectArticle(index: number) {
    this.saveArticle()
    this.editItemIndex = index;
    this.setArticleContent();
  }

  setArticleContent() {
    this.vditor.setValue(this.items[this.editItemIndex].content);
    this.tagList = this.items[this.editItemIndex].tags || []
  }

  customCheck() {
    return true;
  }

  getTagValue(value: any) {
  }
}
