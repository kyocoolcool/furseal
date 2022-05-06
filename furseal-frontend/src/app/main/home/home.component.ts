import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor() {}

  public contentHeader: object

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.contentHeader = {
      headerTitle: '首頁',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: '首頁',
            isLink: false,
            link: '/'
          }
        ]
      }
    }
  }
}
