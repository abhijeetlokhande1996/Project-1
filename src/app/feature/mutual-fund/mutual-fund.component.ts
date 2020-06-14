import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { take } from 'rxjs/operators';
import { IMutualFund } from '../../interfaces/IMutualFund.interface';

@Component({
  selector: 'app-mutual-fund',
  templateUrl: './mutual-fund.component.html',
  styleUrls: ['./mutual-fund.component.css']
})
export class MutualFundComponent implements OnInit {

  mfData: Array<IMutualFund> = [];

  constructor(private dbService: DatabaseService) { }

  ngOnInit(): void {
    this.dbService
      .getMFs()
      .pipe(take(1))
      .subscribe((mfs) => {
        this.mfData = mfs;
        console.log(this.mfData);
      });
  }



}
