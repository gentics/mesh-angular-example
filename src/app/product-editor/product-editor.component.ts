import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';

import { MeshDataService } from '../mesh-data.service';
import { MeshNode, MeshError } from '../mesh-models';
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

  log(wtf: any) {
    console.log(wtf);
  }

  save(node: MeshNode, productForm: NgForm) {
    this.subscription.unsubscribe();
    this.subscription = this.mesh.updateNode(node)
      .subscribe(updatedNode => {
        this.node = observableOf(updatedNode);
        productForm.control.reset(updatedNode.fields);
        this.status = { success: true, error: '' };
        this.clearStatusAfterTimeout();
      }, (response: { error: MeshError }) => {
        this.status = { success: false, error: response.error.message };
        this.clearStatusAfterTimeout();
      });
  }

  clearStatusAfterTimeout() {
    const timeout = setTimeout(() => this.status = undefined, 4000);
    this.subscription = new Subscription(() => clearTimeout(timeout));
  }

}
