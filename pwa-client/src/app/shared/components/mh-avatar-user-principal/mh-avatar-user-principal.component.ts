import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MhAuthorizationServerClientService } from 'src/app/core/services/http/mh-authorization-server-client.service';
import { MhUserServiceClientService } from 'src/app/core/services/http/mh-user-service-client.service';
import { MhAuthorizationHelperService } from 'src/app/core/services/mh-authorization-helper.service';
import { MhTranslateHelperService } from 'src/app/core/services/mh-translate-helper.service';
import { AccountData } from '../../models/AccountData.interface';

@Component({
  selector: 'app-mh-avatar-user-principal',
  templateUrl: './mh-avatar-user-principal.component.html',
  styleUrls: ['./mh-avatar-user-principal.component.scss'],
})
export class MhAvatarUserPrincipalComponent implements OnInit {

  account?: AccountData;

  constructor(
    private menuController: MenuController,
    private translate: TranslateService,
    private translateHelper: MhTranslateHelperService,
    private authorizationHelper: MhAuthorizationHelperService,
    private authorizationClient: MhAuthorizationServerClientService,
    private userClient: MhUserServiceClientService
  ) { }

  ngOnInit() {
    this.translateHelper.setupTranslateService(this.translate);
    this.authorizationHelper.getAuthentication()
      .then((userData) => userData.k2)
      .then(async (token) => await this.authorizationClient.getDecodedToken(token).toPromise())
      .then((decodedToken) => {
        this.userClient.getAccountData(decodedToken.body.sub).subscribe((res)=> {
          this.account = res.body;
        });
      });
  }

  getFullName() {
    return this.account.firstName + ' ' + this.account.lastName;
  }

  closeMenu() {
    this.menuController.close();
  }
}
