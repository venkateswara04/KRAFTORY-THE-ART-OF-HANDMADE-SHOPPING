import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer here

@Component({
  selector: 'app-ar-viewer',
  standalone: true,
  imports: [CommonModule],
  // Add CUSTOM_ELEMENTS_SCHEMA to allow A-Frame tags (like <a-scene>)
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div style="width: 100%; height: 100vh; margin: 0; padding: 0; overflow: hidden;">
      
      <a-scene
        *ngIf="safeVideoUrl"
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        renderer="logarithmicDepthBuffer: true;"
      >
        <a-assets>
          <video
            id="heritageVideo"
            [src]="safeVideoUrl"
            preload="auto"
            loop="true"
            playsinline
            webkit-playsinline
            crossorigin="anonymous"
          ></video>
        </a-assets>

        <a-marker
          type="barcode"
          [value]="pageUrl"
        >
          <a-video
            src="#heritageVideo"
            width="1.6"
            height="0.9"
            rotation="-90 0 0"
            position="0 0.1 0"
            autoplay
          muted></a-video>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>

      <div *ngIf="!safeVideoUrl" style="padding: 20px; text-align: center; color: #333;">
        <p *ngIf="!product" style="font-size: 18px;">Loading AR Experience...</p>
        <p *ngIf="product && !product.heritage_video_url" style="font-size: 18px;">
          This product does not have a heritage video.
        </p> </div>
    </div>
  `
})
export class ArViewerComponent implements OnInit {
  product: any;
  safeVideoUrl?: SafeResourceUrl; 
  pageUrl = ''; 

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private sanitizer: DomSanitizer // <-- FIX: Spelled correctly (DomSanitizer)
  ) {
    this.pageUrl = window.location.href;
  }

  ngOnInit() {
    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      this.api.getProduct(slug).subscribe(res => {
        this.product = res;
        if (this.product && this.product.heritage_video_url) {
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.product.heritage_video_url
          );
        }
      });
    }
  }
}