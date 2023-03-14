import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { InterceptionService } from '../../services/interception.sevice';
import { IFigure, IPoint, ICanvasElement, Square, Line } from "../../Entity/Figure";



const Color = Object.freeze({
  DRAWING: "gray",
  DREW: "black",
  INTERSECT: "red"
})

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

  // Компонент главная страница
export class HomeComponent implements OnInit, OnDestroy {

  private get square(): ICanvasElement | null {
    return this.figures.filter((el) => el.constructor.name === Square.name)[0] ?? null;
  };
  private figures: ICanvasElement[] = [];  
  private figure!: ICanvasElement | null;
  private isSquare: boolean = false;
  private ctx!: CanvasRenderingContext2D;
  private listeners = Array<() => void>();

  @ViewChild("canvas", { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private renderer: Renderer2, private interceptSrvc: InterceptionService, private storeSrvc: StoreService) {
    this.Load();
  }

  // private members
  private ClearCanvas(): void {
    this.ctx?.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  // отключает обработчики событий
  private СlearListeners() {
    for (let listener of this.listeners) {
      listener();
    }
  }

  public DrawSquare(): void {
    if (this.ctx) {
      this.Clear();
      this.isSquare = true;
      this.listeners.push(
        this.renderer.listen(this.canvas.nativeElement, 'mousedown', this.MouseDown.bind(this))
      )
    }
  }

  public DrawLine() {
    if (this.ctx) {
      this.isSquare = false;
      this.listeners.push(
        this.renderer.listen(this.canvas.nativeElement, 'mousedown', this.MouseDown.bind(this))
      )
    }
  }

  // возвращает координаты X и Y относительно элемента canvas (учитывается масштабирование)
  private GetMousePos(evt: MouseEvent): IPoint {
    let rect = this.canvas.nativeElement.getBoundingClientRect();
    let scaleX = this.canvas.nativeElement.width / rect.width;
    let scaleY = this.canvas.nativeElement.height / rect.height;
    return {
      X: (evt.clientX - rect.left) * scaleX,
      Y: (evt.clientY - rect.top) * scaleY
    };
  }

  private async Load() {
    (await this.storeSrvc.Load<IFigure>()).subscribe(figures => this.OnLoad(figures));
  }

  private OnLoad(figures: IFigure[]): void {
    for (let figure of figures) {
      let f: ICanvasElement;
      if (figure.Type?.trim() == Line.name) {
        f = new Line(figure.Start, this.ctx);
      } else {
        f = new Square(figure.Start, this.ctx);
      }
      f.SetFigure(figure)
      f.ReDraw();
      this.figures.push(f);

      if(figure.Type?.trim() == Line.name && this.square && this.interceptSrvc.CheckInterception(f.ToLines(), this.square?.ToLines())) {
        f.SetColor(Color.INTERSECT);
      } else {
       f.SetColor(Color.DREW);
      }
      
    }

    this.UpdateView();
  }

  private OnSave(result: any) {
    console.log("Saved!");
  }

  private UpdateView(): void {
    for (let figure of this.figures) {
      figure.ReDraw();
    }
  }

  // public members
  public MouseDown(e: MouseEvent) {
    let pos = this.GetMousePos(e);
    console.log(`MouseDown: X=${pos.X}, Y=${pos.Y}`);
    if (this.isSquare) {
      this.figure = new Square(pos, this.ctx);
    } else {
      this.figure = new Line(pos, this.ctx);
    }
    this.listeners.push(
      this.renderer.listen(this.canvas.nativeElement, 'mousemove', this.MouseMove.bind(this))
    )
    this.listeners.push(
      this.renderer.listen(this.canvas.nativeElement, 'mouseup', this.MouseUp.bind(this))
    )
  }

  public MouseMove(e: MouseEvent) {
    let pos = this.GetMousePos(e);
    //console.log(`MouseMove: X=${pos.X}, Y=${pos.Y}`);
    this.ClearCanvas();
    this.figure?.Draw(pos);
    if (this.figure != this.square && this.interceptSrvc.CheckInterception(this.figure?.ToLines(), this.square?.ToLines())) {
      this.figure?.SetColor(Color.INTERSECT)
    } else {
      this.figure?.SetColor(Color.DRAWING)
    }
    this.UpdateView();
  }

  public MouseUp(e: MouseEvent): void {
    this.СlearListeners();
    if (this.figure) {
      this.figures.push(this.figure);
      if (this.figure != this.square && this.interceptSrvc.CheckInterception(this.figure?.ToLines(), this.square?.ToLines())) {
        this.figure?.SetColor(Color.INTERSECT);
      } else {
        this.figure.SetColor(Color.DREW)
      }
      this.UpdateView();
    }
  }

  // сохраняем состояние
  public async Save(): Promise<void> {
    await (await this.storeSrvc.Save(this.figures)).subscribe(res => this.OnSave(res))
  }

  // функция вызываемая в процессе жизненнгого цикла компонента
  public ngOnInit(): void {
    let cntxt = this.canvas.nativeElement.getContext("2d");
    if (cntxt) {
      this.ctx = cntxt;
    } else {
      throw new Error("Возникла ошибка при попытке получения контекста")
    }  
  }

  // функция вызываемая в процессе жизненнгого цикла компонента
  public ngOnDestroy() {
    this.СlearListeners();
  }

  public Clear(): void {
    this.figure = null;
    this.figures = [];
    this.ClearCanvas();
  }
}
