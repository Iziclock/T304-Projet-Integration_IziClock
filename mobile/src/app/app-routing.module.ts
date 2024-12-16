import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'calendars',
    loadChildren: () => import('./calendars/calendars.module').then( m => m.CalendarsPageModule)
  },
  {
    path: 'alarm-details/:id',
    loadChildren: () => import('./alarm-details/alarm-details.module').then( m => m.AlarmDetailsPageModule)
  },
  {
    path: 'ringtones',
    loadChildren: () => import('./ringtones/ringtones.module').then( m => m.RingtonesPageModule)
  }, 
  {
    path: 'edit-alarm/:id', //route pour edit-alarm
    loadChildren: () => import('./edit-alarm/edit-alarm.module').then(m => m.EditAlarmePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
