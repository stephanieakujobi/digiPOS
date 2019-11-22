import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", loadChildren: "./pages/login-page/login.module#LoginPageModule" },
  {
    path: "main",
    loadChildren: () =>
      import("./pages/main-page/main-tab-bar/main-tab-bar.module").then(m => m.MainTabBarModule)
  },
  { path: 'place-view-modal', loadChildren: './pages/main-page/places-tab/place-view-modal/place-view-modal.module#PlaceViewModalPageModule' },
  { path: 'places-prefs-modal', loadChildren: './pages/main-page/places-tab/places-prefs/places-prefs-modal.module#PlacesPrefsModalPageModule' },  { path: 'maps-prefs-modal', loadChildren: './pages/main-page/home-tab/maps-prefs-modal/maps-prefs-modal/maps-prefs-modal.module#MapsPrefsModalPageModule' }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }