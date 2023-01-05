import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MhTranslateHelperService} from '../core/services/mh-translate-helper.service';
import {ActivatedRoute} from '@angular/router';
import {MhAuthService} from '../core/services/http/mh-auth.service';
import { AuthorizationCode } from '../shared/models/AuthorizationCode.interface';
import { MhAuthorizationHelperService } from '../core/services/mh-authorization-helper.service';
import { UserDataLocal } from '../shared/models/UserDataLocal.interface';
import { NavController } from '@ionic/angular';

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
    private navigator: NavController,
    private mhAuthService: MhAuthService,
    private mhAuthorizationHelper: MhAuthorizationHelperService
  ) { }

  async ngOnInit() {
    this.translateHelperService.setupTranslateService(this.translate);
  }

  async ionViewDidEnter() {
    this.routeSnapshot.queryParams.subscribe((param) => {
      if (param?.code) {
        const response: AuthorizationCode = { code: param.code, state: param.state };
        this.mhAuthService.getTokenWithAuthorizationCode(response.code).subscribe((auth)=> {
          const userData: UserDataLocal = {
            k1: auth.body.refresh_token,
            k2: auth.body.access_token,
            k3: null
          };

          this.mhAuthorizationHelper.saveAuthentication(userData).then(() => this.navigator.navigateRoot('/client/home'));
        });
      }
    });
  }
}
