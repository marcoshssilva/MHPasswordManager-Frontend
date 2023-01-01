import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MhTranslateHelperService} from '../core/services/mh-translate-helper.service';
import {ActivatedRoute} from '@angular/router';
import {MhAuthService} from '../core/services/http/mh-auth.service';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.page.html',
  styleUrls: ['./authorize.page.scss'],
})
export class AuthorizePage implements OnInit {

  constructor(
    private translate: TranslateService,
    private translateHelperService: MhTranslateHelperService,
    private routeSnapshot: ActivatedRoute,
    private mhAuthService: MhAuthService
  ) { }

  async ngOnInit() {
    this.translateHelperService.setupTranslateService(this.translate);
  }

  async ionViewDidEnter() {
    this.routeSnapshot.queryParams.subscribe(param => console.log(param));
  }
}
