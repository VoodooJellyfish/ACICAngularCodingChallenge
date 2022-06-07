import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { QuoteService } from '../recentQuotes.service';
import { countBy, orderBy, toPairs, take } from 'lodash';
import { insuranceQuote } from '../recentQuotes';

@Component({
  selector: 'app-commonLinesOfBusiness',
  templateUrl: './commonLinesOfBusiness.component.html',
  styleUrls: ['./commonLinesOfBusiness.component.css'],
})
export class commonLinesOfBusinessComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: insuranceQuote[] = [];

  constructor(
    private lineOfBusinessService: LineOfBusinessService,
    private quoteService: QuoteService
  ) {}

  ngOnInit() {
    this.getLinesOfBusiness();
    this.getRecentQuotes();
  }

  get commonLinesOfBusiness(): LineOfBusiness[] {
      let quoteCounts = countBy(
      this.recentQuotes,
      (quote) => quote.lineOfBusiness
    );
    let pairs = toPairs(quoteCounts);
    let quoteOrder = orderBy(pairs, (pair) => pair[1], "desc");
    let topTwo = take(quoteOrder, 2);
    let topTwoLinesOfBusiness = topTwo.map(
      (pair) =>
        this.linesOfBusiness.find((l) => l.id.toString() == pair[0]) ??
        ({
          id: 0,
          name: 'Not Found',
          description: 'Not Found',
        } as LineOfBusiness)
    );
    return topTwoLinesOfBusiness;
  }

  getLinesOfBusiness(): void {
    this.lineOfBusinessService
      .getLinesOfBusiness()
      .subscribe(
        (linesOfBusiness) =>
          (this.linesOfBusiness = linesOfBusiness)
      );
  }

  getRecentQuotes(): void {
    this.quoteService
      .getRecentQuotes()
      .subscribe((recentQuotes) => (this.recentQuotes = recentQuotes));
  }
}