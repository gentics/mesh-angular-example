import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MeshDataService } from '../mesh-data.service';
import { MeshNode } from '../mesh-models';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'demo-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.css']
})
export class ProductEditorComponent implements OnInit, OnDestroy {

  node: Observable<MeshNode>;
  status: { success: boolean, error: string } | undefined;

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private mesh: MeshDataService) { }

  ngOnInit() {
    const nodeUuid = this.route.snapshot.params.uuid;
    this.node = this.mesh.getNode(nodeUuid);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  imageUrl(node: MeshNode) {
    if (node && node.fields) {
        return this.mesh.getBinaryUrl(node.fields.vehicleImage.uuid, 'image');
    }

    return undefined;
  }

}
