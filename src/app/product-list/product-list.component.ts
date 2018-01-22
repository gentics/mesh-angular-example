import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { MeshDataService } from '../mesh-data.service';
import { MeshNode } from '../mesh-models';
import { switchMap } from 'rxjs/operators/switchMap';


@Component({
  selector: 'demo-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  productCategory: Observable<MeshNode>;
  products: Observable<MeshNode[]>;

  constructor(
    private route: ActivatedRoute,
    private mesh: MeshDataService) { }

  ngOnInit() {
    const parentUuid = this.route.params.pipe(map(params => params.uuid as string));
    this.productCategory = parentUuid.pipe(switchMap(uuid => this.mesh.getNode(uuid)));
    this.products = parentUuid.pipe(switchMap(uuid => this.mesh.getChildren(uuid)));
  }

  imageUrl(node: MeshNode) {
    if (node && node.fields) {
        return this.mesh.getBinaryUrl(node.fields.vehicleImage.uuid, 'image');
    }

    return undefined;
  }

}
