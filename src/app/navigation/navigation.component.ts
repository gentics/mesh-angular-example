import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { MeshDataService } from '../mesh-data.service';
import { MeshNode } from '../mesh-models';


@Component({
  selector: 'demo-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {

  activeCategory: string | undefined;
  categories: Observable<MeshNode[]>;

  constructor(
    private router: Router,
    private mesh: MeshDataService) { }

  ngOnInit() {
    this.categories = this.mesh.getRootNodeChildren()
      .pipe(map((nodes: MeshNode[]) =>
        nodes.filter(node => node.schema.name === 'category')
      ));
  }

  isActiveCategory(category: MeshNode) {
    return this.router.isActive('/category/' + category.uuid, true);
  }

}
