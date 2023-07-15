import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ProductComponent implements OnInit {
  private _products = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this._products.asObservable();
  selectedProduct: Product | null = null;
  productForm: FormGroup;
  productSearchControl = new FormControl();
  filteredProducts: Observable<Product[]>;

  constructor(private productService: ProductService, private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      category: ['', Validators.required],
      energy: ['', Validators.required],
      fat: ['', Validators.required],
      carbs: ['', Validators.required],
      protein: ['', Validators.required],
      url: ['', Validators.required],
    });

    this.filteredProducts = this.productSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  ngOnInit(): void {
    this.updateProductsList();
  }

  updateProductsList(): void {
    this.products$ = this.productService.getProducts().pipe(
      catchError(error => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to retrieve products', life: 3000});
        return of([]);
      })
    );
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this._products.value.filter(product => product.name.toLowerCase().includes(filterValue));
  }

  onSelectProduct(product: Product): void {
    this.selectedProduct = product;
    this.productForm.patchValue(product);
  }

  onCreateNewProduct(): void {
    this.selectedProduct = null;
    this.productForm.reset();
    this.productForm.setValue({
      id: null,
      name: '',
      category: '',
      energy: null,
      fat: null,
      carbs: null,
      protein: null,
      url: '',
    });
  }

  onSubmit(): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.productForm.value).pipe(
        catchError((error) => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Product Update Failed', life: 3000});
          return of(null);
        })
      ).subscribe((updatedProduct: Product | null) => {
        if (updatedProduct) {
          const updatedProducts = this._products.value.map(product =>
            product.id === updatedProduct.id ? { ...updatedProduct } : product
          );
          this._products.next(updatedProducts);
          this.updateProductsList();
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
        }
      });
    } else {
      this.productService.addProduct(this.productForm.value).pipe(
        catchError((error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product Creation Failed', life: 3000 });
          return of(null);
        })
      ).subscribe((newProduct: Product | null) => {
        if (newProduct) {
          this._products.next([...this._products.value, newProduct]);
          this.updateProductsList();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Added', life: 3000 });
        }
      });
    }
  }

  onDeleteProduct(): void {
    if (this.selectedProduct && this.selectedProduct.id !== undefined && this.selectedProduct.id !== null) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this product?',
        accept: () => {
          this.productService.deleteProduct(this.selectedProduct!.id!).pipe(
            catchError((error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product Deletion Failed', life: 3000 });
              return of();
            })
          ).subscribe(() => {
            this._products.next(this._products.value.filter(product => product.id !== this.selectedProduct!.id!));
            this.onCreateNewProduct();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            this.updateProductsList();
          });
        }
      });
    }
  }
}
