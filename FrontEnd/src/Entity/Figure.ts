
export interface IPoint {
  X: number;
  Y: number;
}

export interface IFigure {
  Type: string;
  Color: string;
  Start: IPoint;
  End: IPoint;
}

export interface ICanvasElement {
  Draw(point: IPoint): void;
  ReDraw(): void;
  SetColor(color: string): void;
  ToLines(): Array<IPoint[]>;
  SetFigure(val: IFigure): void;
  // Для сериализации
  toJSON(): IFigure;
}

export class Figure implements IFigure {
  // private propersies
  private type!: string;
  private color!: string;
  private start!: IPoint;
  private end!: IPoint;

  public get Type(): string {
    return this.type;
  };
  public set Type(val: string) {
    this.type = val.trim();
  }
  
  public get Color(): string {
    return this.color;
  }
  public set Color(val: string) {
    this.color = val.trim();
  }
  
  public get Start(): IPoint {
    return this.start;
  }
  public set Start(val: IPoint) {
    this.start = val;
  }
  
  public get End(): IPoint {
    return this.end;
  }
  public set End(val: IPoint) {
    this.end = val;
  }

  public set Figure(val: IFigure) {
    this.Color = val.Color;
    this.Type = val.Type;
    this.Start = val.Start;
    this.End = val.End;
  }
}

abstract class CanvasBase extends Figure implements ICanvasElement {

  constructor(start: IPoint) {
    super()
    this.Start = start;
  }

  public Draw(point: IPoint): void {
    throw new Error("Not implemented!");
  }

  public ReDraw(): void {
    this.Draw(this.End);
  }

  public SetColor(color: string) {
    console.log(`SetColor: ${color}`);
    this.Color = color;
    this.ReDraw();
  }

  public ToLines(): Array<IPoint[]> {
    throw Error("Not implemented!");
  }

  public SetFigure(val: IFigure): void {
    this.Figure = val;
  }

  public toJSON(): IFigure {
    return {
      Type: this.Type,
      Start: this.Start,
      End: this.End,
      Color: this.Color
    }
  }
}

export class Line extends CanvasBase {

  constructor(start: IPoint, private ctx: CanvasRenderingContext2D) {
    super(start);
    this.Type = Line.name
  }

  public override Draw(point: IPoint) {
    this.End = point
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.Color;
      this.ctx.moveTo(this.Start.X, this.Start.Y);
      this.ctx.lineTo(this.End.X, this.End.Y);
      this.ctx.stroke();
    }
  }

  public override ToLines(): Array<IPoint[]> {
    return [[this.Start, this.End]];
  }
}

export class Square extends CanvasBase {
  constructor(start: IPoint, private ctx: CanvasRenderingContext2D) {
    super(start);
    this.Type = Square.name
  }

  public override Draw(point: IPoint) {
    this.End = point;
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.Color;
      this.ctx.rect(this.Start.X, this.Start.Y, this.End.X - this.Start.X, this.End.Y - this.Start.Y);
      this.ctx.stroke();
    }
  }

  public override ToLines(): Array<IPoint[]> {
    return [
      [{ X: this.Start.X, Y: this.Start.Y }, { X: this.End.X, Y: this.Start.Y }],
      [{ X: this.End.X, Y: this.Start.Y }, { X: this.End.X, Y: this.End.Y }],
      [{ X: this.Start.X, Y: this.Start.Y }, { X: this.Start.X, Y: this.End.Y }],
      [{ X: this.Start.X, Y: this.End.Y }, { X: this.End.X, Y: this.End.Y }]
    ];
  }
}
