import { Routes } from '@angular/router';
import { CardSiteComponent } from './Components/card-site/card-site.component';
import { HomeComponent } from './Components/home/home.component';
import { AllCardsComponent } from './Components/all-cards/all-cards.component';
import { HubComponent } from './Components/hub/hub.component';
import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';
import { MarketCardSiteComponent } from './Components/market-card-site/market-card-site.component';
import { ChatHubComponent } from './Components/chat-hub/chat-hub.component';
import { ProfileComponent } from './Components/profile/profile.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, title: 'Home' },
    { path: 'browse', component: AllCardsComponent, title: 'Browse all cards' },
    { path: 'collection/:view', component: HubComponent, title: 'Your collection :)' },
    { path: 'market/:id', component: MarketCardSiteComponent, title: 'Card market' },
    { path: 'card/:id', component: CardSiteComponent, title: 'Card Site' },
    { path: 'register', component: RegisterComponent, title: 'Register' },
    { path: 'login', component: LoginComponent, title: 'Log in' },
    { path: 'chat/:userName', component: ChatHubComponent, title: 'Chat' },
    { path: 'profile/:userName', component: ProfileComponent, title: 'Profile' },
    { path: '**', redirectTo:'/home', title: 'Home' }
];
