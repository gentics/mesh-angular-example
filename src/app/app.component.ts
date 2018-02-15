import { Component, OnInit } from '@angular/core';
import { MeshDataService } from './mesh-data.service';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private mesh: MeshDataService) { }

  ngOnInit() {
    this.mesh.login().subscribe();
  }

}
