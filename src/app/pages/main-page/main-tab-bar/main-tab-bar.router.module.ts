import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainTabBarPage } from "./main-tab-bar.page";

const routes: Routes = [
  {
    path: "main-tab-bar",
    component: MainTabBarPage,
    children: [
      {
        path: "home-tab",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../home-tab/home-tab.module").then(m => m.HomeTabModule)
          }
        ]
      },
      {
        path: "businesses-tab",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../businesses-tab/businesses-tab.module").then(
                m => m.BusinessTabModule
              )
          }
        ]
      },
      {
        path: "notifications-tab",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../notifications-tab/notifications-tab.module").then(
                m => m.NotificationsTabModule
              )
          }
        ]
      },
      {
        path: "profile-tab",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../profile-tab/profile-tab.module").then(
                m => m.ProfileTabModule
              )
          }
        ]
      }
    ]
  },
  {
    path: "",
    redirectTo: "/main-tab-bar/home-tab",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainTabBarPageRoutingModule { }