import { Injectable } from '@angular/core';
import { IPoint } from '../Entity/Figure';

@Injectable({
  providedIn: 'root'
})
export class InterceptionService {

  public CheckInterception(line: Array<IPoint[]> | undefined, lines: Array<IPoint[]> | undefined): boolean {

    if (line && lines) {

      let lineAB = line[0]
      let A = lineAB[0]
      let B = lineAB[1]

      for (let lineCD of lines) {
        let C = lineCD[0];
        let D = lineCD[1];
        // https://ru.wikipedia.org/wiki/Пересечение_прямых#Если_заданы_по_две_точки_на_каждой_прямой (пересечение может быть за пределми прямых)
        let Px = (((A.X * B.Y - A.Y * B.X) * (C.X - D.X)) - ((A.X - B.X) * (C.X * D.Y - C.Y * D.X))) / ((A.X - B.X) * (C.Y - D.Y) - (A.Y - B.Y) * (C.X - D.X));
        let Py = ((A.X * B.Y - A.Y * B.X) * (C.Y - D.Y) - (A.Y - B.Y) * (C.X * D.Y - C.Y * D.X)) / ((A.X - B.X) * (C.Y - D.Y) - (A.Y - B.Y) * (C.X - D.X));

        // Проверяем принадлежит ли точка пересечения в допустимых пределах:
        let pointOnAB = (Px - A.X) * (B.Y - A.Y) - (Py - A.Y) * (B.X - A.X) == 0
        let pointOnBC = (Px - C.X) * (D.Y - C.Y) - (Py - C.Y) * (D.X - C.X) == 0
        if (pointOnAB && pointOnBC &&
          ((Math.min(C.X, D.X) <= Px) && (Math.max(D.X, C.X) >= Px) && (Math.min(A.X, B.X) <= Px) && (Math.max(B.X, A.X) >= Px)) ||
          ((Math.min(C.Y, D.Y) <= Py) && (Math.max(D.Y, C.Y) >= Py) && (Math.min(A.Y, B.Y) <= Py) && (Math.max(B.Y, A.Y) >= Py))
        ) {
          return true;
        }        
      }      
    }
    return false;
  }
}
