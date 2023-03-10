import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MhTranslateHelperService } from '../core/services/mh-translate-helper.service';
import { ActivatedRoute } from '@angular/router';
import { MhAuthorizationServerClientService } from '../core/services/http/mh-authorization-server-client.service';
import { AuthorizationCode } from '../shared/models/AuthorizationCode.interface';
import { MhAuthorizationHelperService } from '../core/services/mh-authorization-helper.service';
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
    private mhAuthorizationClientService: MhAuthorizationServerClientService,
    private mhAuthorizationHelper: MhAuthorizationHelperService
  ) { }

  async ngOnInit() {
    this.translateHelperService.setupTranslateService(this.translate);
  }

  async ionViewDidEnter() {
    this.routeSnapshot.queryParams.subscribe((param) => {
      if (param?.code) {
        const response: AuthorizationCode = { code: param.code, state: param.state };
        this.mhAuthorizationClientService.getTokenWithAuthorizationCode(response.code).subscribe((auth)=> {
          this.mhAuthorizationHelper.saveAuthentication(auth.body).then(() => window.location.href = window.location.origin + '/client');
        });
      } else {
        this.navigator.navigateRoot('/client/home');
      }
    });
  }
}
