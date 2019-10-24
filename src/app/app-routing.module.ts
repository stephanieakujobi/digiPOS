import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login-page/login.module").then(m => m.LoginPageModule)
  },
  {
    path: "",
    loadChildren: () =>
      import("./pages/main-page/main-tab-bar/main-tab-bar.module").then(
        m => m.MainTabBarModule
      )
  },
  { path: 'business-view-modal', loadChildren: './pages/main-page/businesses-tab/business-view-modal/business-view-modal.module#BusinessViewModalPageModule' },
  { path: 'business-prefs-modal', loadChildren: './pages/main-page/businesses-tab/business-prefs/business-prefs-modal.module#BusinessPrefsModalPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }