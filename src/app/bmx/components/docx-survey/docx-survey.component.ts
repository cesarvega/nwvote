import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DragulaService } from 'ng2-dragula';
import {
  Document, Packer, Paragraph, TextRun, ImageRun, HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
  AlignmentType,
  File, HeadingLevel, StyleLevel, TableOfContents, Table, TableCell, TableRow, WidthType, BorderStyle, HeightRule, VerticalAlign, Footer, PageNumber, ShadingType, Tab
} from "docx";
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';

import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BmxService } from '../bmx-creator/bmx.service';



@Component({
  selector: 'app-docx-survey',
  templateUrl: './docx-survey.component.html',
  styleUrls: ['./docx-survey.component.scss']
})


export class DocxSurveyComponent implements OnInit {


  @Input() isMenuActive5;
  @Input() reportSettings;
  @Output() dialog: EventEmitter<boolean> = new EventEmitter<boolean>();


  dataSource: any;
  ELEMENT_DATA: any;
  displayedColumns = ['select', 'Name', 'Status'];
  user: any;
  projectName: any;
  selectedDate = new Date('2019/09/26');
  startAt = new Date('2019/09/11');
  minDate = new Date('2019/09/14');
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  sD: any;
  doc;
  total = 0;
  completed = 0;
  design = false;

  reportType;
  nameTyping;
  rational;
  rating;
  imgHeight;
  compWidth = 0;
  compHeight = 0;
  image;
  headers = [];
  criteria = false;
  tinder = false;
  selected = 'All';
  selection;
  viewedData;
  RESPONDENTS_LIST = [];
  projectId = 'topRankDropDown';
  data;
  biLogo;
  companyLogo;
  projectList = []

  constructor(private _hotkeysService: HotkeysService, private dragulaService: DragulaService, private _BmxService: BmxService, private http: HttpClient) { }
  ngOnInit(): any {
    const fs = require('fs');
    this.selection = new SelectionModel<any>(true, []);
    this._BmxService.currentprojectData$.subscribe((projectData) => {
      this.data = projectData !== '' ? projectData : this.projectId;
    });


    this._BmxService.currentProjectName$.subscribe((projectName) => {
      this.projectId = projectName !== '' ? projectName : this.projectId;
      localStorage.setItem('projectName', this.projectId);
      /*
      this._BmxService.getSelectedProjects().subscribe((projects: any) => {
        if (projects) {

          projects.map((newProjectName: any) => {
            if (this.projectId.includes(newProjectName)) {
              this.projectList.push({
                name: newProjectName,
                combine: 1
              })
            } else {
              this.projectList.push({
                name: newProjectName,
                combine: 0
              })
            }
          })
          this.projectList.push({
            name: this.projectId,
            combine: 1
          })
        }
      })
      var test = this.projectList;
      this._BmxService.getBrandMatrixByProjectAllUserAnswers(this.projectId)
        .subscribe(async (arg: any) => {
          if (arg.d && arg.d.length > 0) {
            const data = JSON.parse(arg.d);
            if (data[0]?.BrandMatrix) {
              this.companyLogo = JSON.parse(data[0]?.BrandMatrix)[0].page[0].componentSettings[0].companyLogoURL;
              this.user = await this.createDataObject(JSON.parse(arg.d));
              this.changeView();
              //this.completedStatus(this.user);
              //var imageSrcString;
              //imageSrcString = await this.getBase64ImageFromUrl("https://tools.brandinstitute.com/bmresources/te2647/logo5.JPG")
              let fruits: Array<TextRun>;
              fruits = [];
              for (let i = 0; i < 10; i++) {
                fruits.push(new TextRun
                  (
                    {
                      text: i.toString(),
                      font:
                      {
                        name: "Calibri",
                      },
                      size: 20,
                    }
                  )

                )
              }
              
            }
          }
        });*/
    });
    this.projectList.push(this.projectId);
    this.projectList.push('FROMTEMPLATE2ENG');
    this.projectList.push('FROMTEMPLATERAM');
    this.mergeData(this.projectList);
  }

  mergeData(t: any)
  {
    this.user = [];
    for (var i = 0; i < t.length; i++) {

      this._BmxService.getBrandMatrixByProjectAllUserAnswers(t[i])
      .subscribe(async (arg: any) => {
        if (arg.d && arg.d.length > 0) {
          const data = JSON.parse(arg.d);
          if (data[0]?.BrandMatrix) {
            this.companyLogo = JSON.parse(data[0]?.BrandMatrix)[0].page[0].componentSettings[0].companyLogoURL;
            var temp = await this.createDataObject(JSON.parse(arg.d));
            this.user = this.user.concat(temp);
            /*this.user = await this.createDataObject(JSON.parse(arg.d));*/
            this.changeView();
            //this.completedStatus(this.user);
            //var imageSrcString;
            //imageSrcString = await this.getBase64ImageFromUrl("https://tools.brandinstitute.com/bmresources/te2647/logo5.JPG")
            let fruits: Array<TextRun>;
            fruits = [];
            for (let i = 0; i < 10; i++) {
              fruits.push(new TextRun
                (
                  {
                    text: i.toString(),
                    font:
                    {
                      name: "Calibri",
                    },
                    size: 20,
                  }
                )

              )
            }
            
          }
        }
      });
    }
    
  }

  async createDataObject(t: any): Promise<any> {
    var done = [];
    this.companyLogo = await this.imageToBuffer(this.companyLogo);
    this.biLogo = await this.imageToBuffer('https://tools.brandinstitute.com/bmresources/brandInstituteAssets/bi-logo.PNG');
    this.projectName = t[0].ProjectName;
    for (var z = 0; z < t.length; z++) {
      var hasData = false;
      var recept =
      {
        name: "",
        email: "",
        Status: "",
        responses: [],
      }
      recept.name = t[z].FirstName + " " + t[z].LastName;
      recept.email = t[z].Email;
      recept.Status = t[z].Status.toString();
      if (Number(recept.Status) < 0) {
        recept.Status = 'Not started'
      }
      else if (Number(recept.Status) === 999) {
        recept.Status = 'Finished'
        this.completed++;
      }
      else {
        Number(recept.Status)
      }
      var s = JSON.parse(t[z].BrandMatrix);
      for (var x = 0; x < s.length; x++) {
        var response =
        {
          page: "",
          questyonType: "",
          answers: []
        }
        response.page = s[x].pageNumber;
        var quir = s[x].page
        var r;
        for (var w = 0; w < quir.length; w++) {
          if (Array.isArray(s[x].page[w].componentText)) {
            r = s[x].page[w].componentText;
            hasData = true;
            this.nameTyping = this.getModTestName(r[0].nameCandidates);
            this.rating = r[0].RATE;

            for (var y = 1; y < r.length; y++) {
              var p = r[y];
              var test = r[y].RATE;
              if (r[y].multipleChoice !== undefined) {
                response.questyonType = "multipleChoice";
                this.reportType = "multipleChoice";
                var answMC =
                {
                  comment: "",
                  nameCandidate: "",
                  score: [],
                  rational: ""
                }
                answMC.comment = r[y].Comments0;
                if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                  this.design = true;
                  answMC.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                }
                else {
                  answMC.nameCandidate = this.getModTestName(r[y].nameCandidates);
                }
                answMC.rational = r[y].rationale
                answMC.score = r[y].multipleChoice.split(",");
                if (answMC.score.length > 0) {
                  answMC.score.pop()
                }
                response.answers.push(answMC);
              }
              else if (r[y].RATE !== undefined) {
                if (r[y].CRITERIA !== undefined) {
                  response.questyonType = "criteria";
                  this.reportType = "criteria";
                  var answCR =
                  {
                    comment: "",
                    nameCandidate: "",
                    score: [],
                    rationale: ""
                  }
                  answCR.comment = r[y].Comments0;
                  if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                    this.design = true;
                    answCR.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                  }
                  else {
                    answCR.nameCandidate = this.getModTestName(r[y].nameCandidates);
                  }
                  answCR.rationale = r[y].rationale;
                  answCR.score = r[y].CRITERIA;
                  response.answers.push(answCR);

                }
                else {
                  this.reportType = "rate";
                  response.questyonType = "rate";
                  var answRT =
                  {
                    comment: "",
                    nameCandidate: "",
                    score: 0,
                    rationale: ""
                  }
                  answRT.comment = r[y].Comments0;
                  answRT.nameCandidate = r[y].nameCandidates;
                  if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                    this.design = true;
                    answRT.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                  }
                  else {
                    answRT.nameCandidate = this.getModTestName(r[y].nameCandidates);
                  }
                  answRT.rationale = r[y].rationale;
                  answRT.score = r[y].RATE;
                  if (answRT.score > 0) {
                    response.answers.push(answRT);
                  }
                }
              }
              else if (r[y].vote !== undefined) {
                if (r[y].CRITERIA !== undefined) {
                  response.questyonType = "criteria";
                  this.reportType = "criteria";
                  var answCR =
                  {
                    comment: "",
                    nameCandidate: "",
                    score: [],
                    rationale: ""
                  }
                  answCR.comment = r[y].Comments0;
                  if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                    this.design = true;
                    answCR.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                  }
                  else {
                    answCR.nameCandidate = this.getModTestName(r[y].nameCandidates);
                  }
                  answCR.rationale = r[y].rationale;
                  answCR.score = r[y].CRITERIA;
                  response.answers.push(answCR);

                }
                else {
                  this.reportType = "vote";
                  response.questyonType = "vote";
                  var answRT =
                  {
                    comment: "",
                    nameCandidate: "",
                    score: 0,
                    rationale: ""
                  }
                  answRT.comment = r[y].Comments0;
                  answRT.nameCandidate = r[y].nameCandidates;
                  if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                    this.design = true;
                    answRT.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                  }
                  else {
                    answRT.nameCandidate = this.getModTestName(r[y].nameCandidates);
                  }
                  answRT.rationale = r[y].rationale;
                  if (r[y].vote == "positive") {
                    answRT.score = 1;
                  }
                  else {
                    answRT.score = -1;
                  }
                  if (answRT.score != 0) {
                    response.answers.push(answRT);
                  }
                }
              }
            }
            recept.responses.push(response);
          }
        }
      }
      if (hasData) {
        done.push(recept);
      }
    }
    this.total += done.length;
    return done;
  }

  async imageToBuffer(t: string): Promise<string> {
    var imageSrcString;
    imageSrcString = await this.getBase64ImageFromUrl(t)
    var img = new Image();
    let dimesions = await this.getDimensions(imageSrcString);
    var width = dimesions["width"];
    var height = dimesions["height"];
    if (this.compHeight == 0) {
      this.compHeight = height;
      this.compWidth = width;
    }
    this.imgHeight = height;
    return imageSrcString.split(imageSrcString.split(",")[0] + ',').pop()
  }

  getDimensions(image: string) {
    return new Promise((resolve, reject) => {

      var img = new Image();
      img.src = image;

      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }

    })
  }

  createHeader(t: any, tableType: string): TableRow {
    var arr = [];
    for (let i = 0; i < t.length; i++) {
      var size = 33;
      if (this.reportType === "criteria" && (i === 2 || i === 3)) {
        size = size / 2;
      }
      else if (t.length == 4 && (i === 0 || i === 3) && tableType == "overall") {
        size = 10;
      }
      else if (t.length == 4 && (i === 1 || i === 2) && tableType == "overall") {
        size = 40;
      }
      else if (t.length == 4 && (i === 0) && tableType == "byPage") {
        size = 10;
      }
      else if (t.length == 4 && (i !== 0) && tableType == "byPage") {
        size = 30;
      }
      else if (t.length == 4 && (i === 4) && tableType == "byRespondants") {
        size = 10;
      }
      else if (t.length == 4 && (i !== 4) && tableType == "byRespondants") {
        size = 30;
      }
      arr.push(
        new TableCell({
          width: {
            size: size,
            type: WidthType.PERCENTAGE,
          },
          shading: {
            fill: "073763",
            type: ShadingType.CLEAR,
            color: "auto",
          },
          children: [new Paragraph({
            spacing: {
              before: 200,
              after: 200,
            },
            alignment: AlignmentType.CENTER,
            children:
              [
                new TextRun
                  (
                    {
                      text: t[i],
                      bold: true,
                      font:
                      {
                        name: "Calibri",
                      },
                      color: "FFFFFF",
                      size: 20,
                    }
                  ),
              ]
          })],
        }),
      )
    }
    return new TableRow({
      tableHeader: true,
      children: arr,
    });

  }

  createTable(): Table {

    let row: Array<TableRow>;
    row = [];

    row.push(
      this.createHeader(["Name", "Email", "Status"], "receptHeader")
    );

    for (var i = 0; i < this.user.length; i++) {
      row.push(new TableRow
        (
          {
            children: [
              new TableCell({
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  spacing: {
                    before: 200,
                    after: 200,
                  },
                  alignment: AlignmentType.CENTER,
                  children:
                    [
                      new TextRun
                        (
                          {
                            text: this.user[i].name,
                            bold: true,
                            font:
                            {
                              name: "Calibri",
                            },
                            color: "000000",
                            size: 20,
                          }
                        ),
                    ]
                })],
              }),
              new TableCell({
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  spacing: {
                    before: 200,
                    after: 200,
                  },
                  alignment: AlignmentType.CENTER,
                  children:
                    [
                      new TextRun
                        (
                          {
                            text: this.user[i].email,
                            font:
                            {
                              name: "Calibri",
                            },
                            color: "000000",
                            size: 20,
                          }
                        ),
                    ]
                })],
              }),
              new TableCell({
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },

                children: [new Paragraph({
                  spacing: {
                    before: 200,
                    after: 200,
                  },
                  alignment: AlignmentType.CENTER,
                  children:
                    [
                      new TextRun
                        (
                          {
                            text: this.user[i].Status,
                            font:
                            {
                              name: "Calibri",
                            },
                            color: "000000",
                            size: 20,
                          }
                        ),
                    ]
                })],
              }),
            ],
          }
        )

      )
    }


    const table = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: row

    });
    row = [];
    return table
  }

  overallTable(pagesPring: any): Table {
    var overall = this.sortOverall(pagesPring);
    let row: Array<TableRow>;
    row = [];
    if (this.reportType == 'vote') {
      row.push(
        this.createHeader(["Rank", "Test Names", "Rationale", "Strike Rate"], "overall")
      )
    }
    else {
      row.push(
        this.createHeader(["Rank", "Test Names", "Rationale", "Scores"], "overall")
      )
    }

    for (var i = 0; i < overall.length; i++) {
      if (!this.design) {
        row.push(new TableRow
          (
            {
              children: [
                new TableCell({
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new TextRun
                          (
                            {
                              text: (i + 1).toString(),
                              bold: true,
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 40,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new TextRun
                          (
                            {
                              text: overall[i][0].split("*")[0],
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 40,
                    type: WidthType.PERCENTAGE,
                  },
                  margins:
                  {
                    left: 500,
                    right: 500
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new TextRun
                          (
                            {
                              text: overall[i][0].split("*")[1],
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },

                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new TextRun
                          (
                            {
                              text: overall[i][1].toString(),
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
              ],
            }
          )

        )
      }
      else {
        row.push(new TableRow
          (
            {
              children: [
                new TableCell({
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new TextRun
                          (
                            {
                              text: (i + 1).toString(),
                              bold: true,
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new ImageRun({
                          data: Buffer.from(overall[i][0], "base64"),
                          transformation: {
                            width: 286,
                            height: this.imgHeight,
                          },
                        }),
                      ]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },

                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new TextRun
                          (
                            {
                              text: overall[i][1].toString(),
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
              ],
            }
          )

        )
      }

    }


    const table = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: row

    });
    row = [];
    return table
  }

  overallMultipleChoice(pagesPring: any): Table {
    var overall = this.sortMultipleChoice(pagesPring);
    let row: Array<TableRow>;
    row = [];


    row.push(
      this.createHeader(["Question", "Scores",], "hello")
    )
    for (var i = 0; i < overall.length; i++) {

      let textRow = [];
      for (var j = 0; j < overall[i].sortedArray.length; j++) {
        if (j === 0 && i === 0) {
          textRow.push(
            new TextRun
              (
                {
                  text: "[" + overall[i].sortedArray[j][0] + "] " + overall[i].sortedArray[j][1],
                  font:
                  {
                    name: "Calibri",
                  },
                  color: "000000",
                  size: 20,
                }
              ),
          )
        }
        else {
          textRow.push(
            new TextRun
              (
                {
                  text: "[" + overall[i].sortedArray[j][0] + "] " + overall[i].sortedArray[j][1],
                  font:
                  {
                    name: "Calibri",
                  },
                  color: "000000",
                  size: 20,
                  break: 1
                }
              ),
          )
        }
      }

      row.push(new TableRow
        (
          {
            children: [
              new TableCell({
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  spacing: {
                    before: 200,
                    after: 200,
                  },
                  alignment: AlignmentType.LEFT,
                  children:
                    [
                      new TextRun
                        (
                          {
                            text: overall[i].question,
                            bold: true,
                            font:
                            {
                              name: "Calibri",
                            },
                            color: "000000",
                            size: 20,
                          }
                        ),
                    ]
                })],
              }),
              new TableCell({
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  spacing: {

                    before: 200,
                    after: 200,
                  },
                  alignment: AlignmentType.LEFT,
                  children: textRow
                })],
              }),
            ],
          }
        )

      )


    }


    const table = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: row

    });
    row = [];
    return table

  }

  sortMultipleChoice(pagesPring: any): any {
    let rankings = new Map();
    let answer = new Map();
    for (var i = 0; i < this.user.length; i++) {
      var x = this.user[i];
      for (var j = 0; j < x.responses.length; j++) {
        var y = x.responses[j];
        if (pagesPring.includes(y.page)) {
          if (y.questyonType === "multipleChoice") {
            for (var k = 0; k < y.answers.length; k++) {
              for (var l = 0; l < y.answers[k].score.length; l++) {
                if (rankings.has(y.answers[k].nameCandidate)) {
                  var temp = rankings.get(y.answers[k].nameCandidate)
                  if (temp.has(y.answers[k].score[l])) {
                    temp.set(y.answers[k].score[l], (temp.get(y.answers[k].score[l]) + 1));
                    rankings.set(y.answers[k].nameCandidate, temp);
                  }
                  else {
                    temp.set(y.answers[k].score[l], 1)
                    rankings.set(y.answers[k].nameCandidate, temp);
                  }
                }
                else {
                  answer = new Map();
                  answer.set(y.answers[k].score[l], 1)
                  rankings.set(y.answers[k].nameCandidate, answer);
                }
              }
            }
          }

        }
      }
    }

    var test = Array.from(rankings);
    var output = [];
    for (var i = 0; i < test.length; i++) {
      var recept =
      {
        question: "",
        sortedArray: [],
      }
      recept.question = test[i][0];
      recept.sortedArray = Array.from(test[i][1]).sort(function (a, b) {
        if (a[1] === b[1]) {
          return 0;
        }
        else {
          return (a[1] > b[1]) ? -1 : 1;
        }
      });;
      output.push(recept);
    }
    return output;
  }

  commentTable(pagesPring: any): Table {
    var overall = this.grabComments(pagesPring);
    let row: Array<TableRow>;
    let a: Array<TextRun>
    row = [];


    row.push(
      this.createHeader(["Name", "Rationale", "Comments"], "byComment")
    )
    for (var i = 0; i < overall.length; i++) {
      a = [];
      for (var j = 0; j < overall[i][1].length; j++) {
        var w = overall[i][1][j].comment
        a.push(new TextRun
          (
            {
              text: overall[i][1][j].comment,
              font:
              {
                name: "Calibri",
              },
              size: 20,
            }
          )

        )
        a.push(new TextRun
          (
            {
              text: "[",
              font:
              {
                name: "Calibri",
              },
              size: 20,
            }
          )

        )
        a.push(new TextRun
          (
            {
              text: overall[i][1][j].name,
              font:
              {
                name: "Calibri",
              },
              size: 20,
            }
          )

        )
        a.push(new TextRun
          (
            {
              text: "]",
              font:
              {
                name: "Calibri",
              },
              size: 20,
            }
          )

        )
        a.push(new TextRun
          (
            {
              break: 1
            }
          )

        )
      }
      if (!this.design) {
        row.push(new TableRow
          (
            {
              children: [
                new TableCell({
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new TextRun
                          (
                            {
                              text: overall[i][0].split("*")[0],
                              bold: true,
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  margins:
                  {
                    left: 500,
                    right: 500
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new TextRun
                          (
                            {
                              text: overall[i][0].split("*")[1],
                              bold: true,
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  margins:
                  {
                    left: 500,
                    right: 500
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.LEFT,
                    children: a
                  })],
                }),
              ],
            }
          )

        )
      }
      else {
        row.push(new TableRow
          (
            {
              children: [

                new TableCell({
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.CENTER,
                    children:
                      [
                        new ImageRun({
                          data: Buffer.from(overall[i][0], "base64"),
                          transformation: {
                            width: 286,
                            height: this.imgHeight,
                          },
                        }),
                      ]
                  })],
                }),
                new TableCell({
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 200,
                      after: 200,
                    },
                    alignment: AlignmentType.LEFT,
                    children: a
                  })],
                }),
              ],
            }
          )

        )
      }

    }


    const table = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: row

    });
    row = [];
    return table
  }

  sortOverall(pagesPring: any): any {

    let rankings = new Map();
    for (var i = 0; i < this.user.length; i++) {
      var x = this.user[i];
      for (var j = 0; j < x.responses.length; j++) {
        var y = x.responses[j];
        if (pagesPring.includes(y.page)) {
          if (y.questyonType === 'rate') {
            for (var k = 0; k < y.answers.length; k++) {
              var combinedStr = y.answers[k].nameCandidate + "*" + y.answers[k].rationale;

              if (rankings.has(combinedStr)) {
                rankings.set(combinedStr, (Number(rankings.get(combinedStr)) + Number((y.answers[k].score))));
              }
              else {
                rankings.set(combinedStr, Number((y.answers[k].score)));
              }


            }

          }
          else if (y.questyonType === 'criteria') {
            for (var k = 0; k < y.answers.length; k++) {
              var combinedStr = y.answers[k].nameCandidate + "*" + y.answers[k].rationale;
              if (rankings.has(combinedStr)) {
                rankings.set(combinedStr, (rankings.get(combinedStr) + y.answers[k].score[0].RATE + y.answers[k].score[1].RATE));
              }
              else {
                rankings.set(combinedStr, (y.answers[k].score[0].RATE + y.answers[k].score[1].RATE));
              }


            }
          }
          else if (y.questyonType === 'vote') {
            for (var k = 0; k < y.answers.length; k++) {
              var combinedStr = y.answers[k].nameCandidate + "*" + y.answers[k].rationale;
              if (y.answers[k].score == 1) {
                if (rankings.has(combinedStr)) {
                  rankings.set(combinedStr, (Number(rankings.get(combinedStr)) + Number((y.answers[k].score))),);
                }
                else {
                  rankings.set(combinedStr, Number((y.answers[k].score)));
                }
              }
            }
          }
        }

      }
    }
    var test = Array.from(rankings);
    test.sort(function (a, b) {
      if (a[1] === b[1]) {
        return 0;
      }
      else {
        return (a[1] > b[1]) ? -1 : 1;
      }
    });
    return test;
  }

  grabComments(pagesPring: any): any {
    let comments = new Map();
    type user = { name: string; comment: string; };
    let a: user[];

    for (var i = 0; i < this.user.length; i++) {
      var x = this.user[i];
      for (var j = 0; j < x.responses.length; j++) {
        var y = x.responses[j];
        if (pagesPring.includes(y.page)) {
          for (var k = 0; k < y.answers.length; k++) {
            a = [];
            var combinedStr = y.answers[k].nameCandidate + "*" + y.answers[k].rationale;
            if (comments.has(combinedStr) && (y.answers[k].comment !== "" && y.answers[k].comment !== undefined)) {
              a = comments.get(combinedStr)
              a.push({ name: this.user[i].name, comment: y.answers[k].comment })
              comments.set(combinedStr, a);
            }
            else if (!comments.has(combinedStr) && (y.answers[k].comment !== "" && y.answers[k].comment !== undefined)) {
              a.push({ name: this.user[i].name, comment: y.answers[k].comment })
              comments.set(combinedStr, a);
            }

          }

        }
      }
    }
    var test = Array.from(comments);
    return test;
  }

  byPage(pagesPring: any): Table {
    var overall = this.answerBYPage(pagesPring);
    let row: Array<TableRow>;
    row = [];
    row.push(
      this.createHeader(["Page", this.nameTyping, "Rationale", "Answer",], "byPage")
    )
    var skip = false;
    for (var i = 0; i < overall.length; i++) {
      for (var j = 0; j < overall[i].question.length; j++) {
        let textRow = [];
        if (j === 0) {
          textRow.push(
            new TextRun
              (
                {

                  text: overall[i].page.toString(),
                  font:
                  {
                    name: "Calibri",
                  },
                  color: "000000",
                  size: 20,
                }
              ),
          )
        }
        else {
          textRow.push(
            new TextRun
              (
                {
                  text: "",
                  font:
                  {
                    name: "Calibri",
                  },
                  color: "000000",
                  size: 20,
                }
              ),
          )
        }
        let m = overall[i].question[j].question;
        let n = overall[i].question[j].resp;
        var partInfo = []

        for (var k = 0; k < overall[i].question[j].resp.length; k++) {
          if (this.reportType === "rate") {
            partInfo.push(
              new TextRun
                (
                  {
                    text: "[" + overall[i].question[j].resp[k].name + "]" + " " + overall[i].question[j].resp[k].value.toString(),
                    font:
                    {
                      name: "Calibri",
                    },
                    color: "000000",
                    size: 20,
                  }
                ),
            )
          }
          else if (this.reportType === "vote") {
            var state = "";
            if (overall[i].question[j].resp[k].value.toString() == '1') {
              state = "Positive"
            }
            else {
              state = "Negative";
            }
            partInfo.push(
              new TextRun
                (
                  {
                    text: "[" + overall[i].question[j].resp[k].name + "]" + " " + state,
                    font:
                    {
                      name: "Calibri",
                    },
                    color: "000000",
                    size: 20,
                  }
                ),
            )

          }
          else if (this.reportType === "criteria") {
            if (overall[i].question[j].resp[k].value[0].RATE.toString() != "-1") {
              skip = false;
              partInfo.push(
                new TextRun
                  (
                    {
                      text: "[" + overall[i].question[j].resp[k].name + "]" + " " + overall[i].question[j].resp[k].value[0].RATE.toString() + " " + overall[i].question[j].resp[k].value[1].RATE.toString(),
                      font:
                      {
                        name: "Calibri",
                      },
                      color: "000000",
                      size: 20,
                    }
                  ),
              )
            }
          }
          if (k != overall[i].question[j].resp.length - 1 && !skip) {
            partInfo.push(
              new TextRun
                (
                  {
                    font:
                    {
                      name: "Calibri",
                    },
                    color: "000000",
                    size: 20,
                    break: 1
                  }
                ),
            )
          }
        }
        if (!this.design) {
          row.push(new TableRow
            (
              {
                children: [
                  new TableCell({
                    width: {
                      size: 10,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 200,
                        after: 200,
                      },
                      alignment: AlignmentType.CENTER,
                      children: textRow

                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 200,
                        after: 200,
                      },
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun
                          (
                            {
                              text: overall[i].question[j].question.split("*")[0],
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    margins:
                    {
                      left: 500,
                      right: 500
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 200,
                        after: 200,
                      },
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun
                          (
                            {
                              text: overall[i].question[j].question.split("*")[1],
                              font:
                              {
                                name: "Calibri",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 200,
                        after: 200,
                      },
                      alignment: AlignmentType.LEFT,
                      children: partInfo
                    })],
                  })
                ]
              }))
        }
        else {
          row.push(new TableRow
            (
              {
                children: [
                  new TableCell({
                    width: {
                      size: 33,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 200,
                        after: 200,
                      },
                      alignment: AlignmentType.CENTER,
                      children: textRow

                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 33,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 200,
                        after: 200,
                      },
                      alignment: AlignmentType.CENTER,
                      children:
                        [
                          new ImageRun({
                            data: Buffer.from(overall[i].question[j].question, "base64"),
                            transformation: {
                              width: 286,
                              height: this.imgHeight,
                            },
                          }),
                        ]
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 33,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 200,
                        after: 200,
                      },
                      alignment: AlignmentType.LEFT,
                      children: partInfo
                    })],
                  })
                ]
              }))
        }
        let y = "mdaskndlas";
      }
    }




    const table = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: row

    });
    row = [];
    return table
  }

  answerBYPage(pagesPring: any): any {

    type user = { name: string; value: string; };
    let a: user[];
    var output = [];

    let page = new Map();

    for (var i = 0; i < this.user.length; i++) {
      var x = this.user[i];
      for (var j = 0; j < x.responses.length; j++) {
        var y = x.responses[j];
        if (pagesPring.includes(y.page)) {
          for (var k = 0; k < y.answers.length; k++) {
            a = [];
            var combinedStr = y.answers[k].nameCandidate + "*" + y.answers[k].rationale;
            if (page.has(y.page)) {
              var temp = page.get(y.page)
              if (temp.has(combinedStr)) {
                a = temp.get(combinedStr);
                a.push({ name: this.user[i].name, value: y.answers[k].score })
                temp.set(combinedStr, a)
                page.set(y.page, temp)
              }
              else {
                a.push({ name: this.user[i].name, value: y.answers[k].score })
                temp.set(combinedStr, a)
                page.set(y.page, temp);
              }
            }
            else {
              a.push({ name: this.user[i].name, value: y.answers[k].score })
              var names = new Map();
              names.set(combinedStr, a)
              page.set(y.page, names);
            }
          }

        }
      }
    }

    var test = Array.from(page);
    var output = [];
    for (var i = 0; i < test.length; i++) {
      var pages =
      {
        page: 0,
        question: []
      }
      pages.page = Number(test[i][0]);
      var m = Array.from(test[i][1]);
      for (var j = 0; j < m.length; j++) {
        var recept =
        {
          resp: [],
          question: ""
        }
        recept.question = m[j][0].toString();
        recept.resp = m[j][1];
        pages.question.push(recept);
      }
      output.push(pages);
    }
    output.sort(function (a, b) {
      if (a[1] === b[1]) {
        return 0;
      }
      else {
        return (a[1] > b[1]) ? -1 : 1;
      }
    });;

    return output;
  }

  byRespondant(pagesPring: any): Table {
    var overall = this.answerbyRespondat(pagesPring);
    let row: Array<TableRow>;
    row = [];
    if (this.reportType === "rate") {
      row.push(
        this.createHeader(["Name", this.nameTyping, "Rationale", "Answer",], "byRespondants")
      )
    }
    else if (this.reportType === "criteria") {
      var test = overall[0][1][0].score[0].name
      row.push(
        this.createHeader(["Name", this.nameTyping, "Rationale", overall[0][1][0].score[0].name, overall[0][1][0].score[1].name], "criteria")
      )
    }
    else if (this.reportType === "vote") {
      row.push(
        this.createHeader(["Name", this.nameTyping, "Rationale", "Answer",], "byRespondants")
      )
    }
    for (var i = 0; i < overall.length; i++) {

      for (var j = 0; j < overall[i][1].length; j++) {
        let partInfo = []
        let textRow = [];

        if (j === 0) {
          textRow.push(
            new TextRun
              (
                {
                  text: overall[i][0],
                  font:
                  {
                    name: "Calibri",
                  },
                  color: "000000",
                  size: 20,
                }
              ),
          )
        }
        else {
          textRow.push(
            new TextRun
              (
                {
                  text: "",
                  font:
                  {
                    name: "Calibri",
                  },
                  color: "000000",
                  size: 20,
                }
              ),
          )
        }
        let cell: Array<TableCell>;
        cell = [];

        cell.push(new TableCell({
          width: {
            size: 30,
            type: WidthType.PERCENTAGE,
          },
          children: [new Paragraph({
            spacing: {
              before: 200,
              after: 200,
            },
            alignment: AlignmentType.CENTER,
            children: textRow
          })],
        }))

        if (!this.design) {
          cell.push(new TableCell({
            width: {
              size: 30,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({
              spacing: {
                before: 200,
                after: 200,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].question.split("*")[0],
                      font:
                      {
                        name: "Calibri",
                      },
                      color: "000000",
                      size: 20,
                    }
                  ),
              ]
            })],
          }));
          cell.push(new TableCell({
            width: {
              size: 30,
              type: WidthType.PERCENTAGE,
            },
            margins:
            {
              left: 500,
              right: 500
            },
            children: [new Paragraph({
              spacing: {
                before: 200,
                after: 200,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].question.split("*")[1],
                      font:
                      {
                        name: "Calibri",
                      },
                      color: "000000",
                      size: 20,
                    }
                  ),
              ]
            })],
          }))
        }
        else {
          cell.push(new TableCell({
            width: {
              size: 33,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({
              spacing: {
                before: 200,
                after: 200,
              },
              alignment: AlignmentType.CENTER,
              children:
                [
                  new ImageRun({
                    data: Buffer.from(overall[i][1][j].question, "base64"),
                    transformation: {
                      width: 286,
                      height: this.imgHeight,
                    },
                  }),
                ]
            })],
          }))
        }

        if (this.reportType === "criteria") {
          cell.push(new TableCell({
            children: [new Paragraph({
              spacing: {
                before: 200,
                after: 200,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].score[0].RATE,
                      font:
                      {
                        name: "Calibri",
                      },
                      color: "000000",
                      size: 20,
                    }
                  ),
              ]
            })],
          })

            ,)
          cell.push(new TableCell({
            children: [new Paragraph({
              spacing: {
                before: 200,
                after: 200,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].score[1].RATE,
                      font:
                      {
                        name: "Calibri",
                      },
                      color: "000000",
                      size: 20,
                    }
                  ),
              ]
            })],
          }))

        }
        else if (this.reportType === "vote") {
          var state = "";
          if (overall[i][1][j].score == 1) {
            state = "Positive"
          }
          else {
            state = "Negative"
          }
          cell.push(new TableCell({
            width: {
              size: 10,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({
              spacing: {
                before: 200,
                after: 200,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: state,
                      font:
                      {
                        name: "Calibri",
                      },
                      color: "000000",
                      size: 20,
                    }
                  ),
              ]
            })],
          }))
        }
        else {
          cell.push(new TableCell({
            width: {
              size: 10,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({
              spacing: {
                before: 200,
                after: 200,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].score,
                      font:
                      {
                        name: "Calibri",
                      },
                      color: "000000",
                      size: 20,
                    }
                  ),
              ]
            })],
          }))
        }


        row.push(new TableRow
          (
            {
              children: cell
            }
          )

        )

      }



    }


    const table = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: row

    });
    row = [];
    return table
  }

  answerbyRespondat(pagesPring: any): any {
    let comments = new Map();


    if (this.reportType === "rate") {
      type user = { question: string; score: string; };
      let a: user[];

      for (var i = 0; i < this.user.length; i++) {
        var x = this.user[i];
        for (var j = 0; j < x.responses.length; j++) {
          var y = x.responses[j];
          if (pagesPring.includes(y.page)) {
            for (var k = 0; k < y.answers.length; k++) {
              a = [];
              var combinedStr = y.answers[k].nameCandidate + "*" + y.answers[k].rationale;
              if (comments.has(x.name) && y.answers[k].score.length !== 0) {
                a = comments.get(x.name)
                a.push({ question: combinedStr, score: y.answers[k].score.toString() })
                comments.set(x.name, a);
              }
              else if (!comments.has(x.name) && y.answers[k].score.length !== 0) {
                a.push({ question: combinedStr, score: y.answers[k].score.toString() })
                comments.set(x.name, a);
              }
            }
          }


        }
      }

    }
    else if (this.reportType === "criteria" || this.reportType === "vote") {
      type user = { question: string; score: []; };
      let a: user[];

      for (var i = 0; i < this.user.length; i++) {
        var x = this.user[i];
        for (var j = 0; j < x.responses.length; j++) {
          var y = x.responses[j];
          for (var k = 0; k < y.answers.length; k++) {
            a = [];
            var combinedStr = y.answers[k].nameCandidate + "*" + y.answers[k].rationale;
            if (comments.has(x.name) && y.answers[k].score.length !== 0) {
              a = comments.get(x.name)
              a.push({ question: combinedStr, score: y.answers[k].score })
              comments.set(x.name, a);
            }
            else if (!comments.has(x.name) && y.answers[k].score.length !== 0) {
              a.push({ question: combinedStr, score: y.answers[k].score })
              comments.set(x.name, a);
            }
          }
        }
      }
    }



    var test = Array.from(comments);
    return test;
  }

  getModTestName(testname: string) {
    if (testname.includes('<span')) {
      return testname.substring(
        testname.indexOf(">") + 1,
        testname.lastIndexOf("</")
      );
    }
    else
      return testname;
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  changeView(): void {
    this.viewedData = [];
    for (let i = 0; i < this.user.length; i++) {
      if (this.selected == 'NS' && this.user[i].Status == 'Not started') {
        this.viewedData.push(this.user[i])
      }
      else if (this.selected == 'NF' && this.user[i].Status != 'Not started' && this.user[i].Status != 'Finished') {
        this.viewedData.push(this.user[i])
      }
      else if (this.selected == 'F' && this.user[i].Status == 'Finished') {
        this.viewedData.push(this.user[i])
      }
      else if (this.selected == 'All') {
        this.viewedData = this.user;
        break;
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.viewedData);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.RESPONDENTS_LIST = [];
    }
    else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        this.RESPONDENTS_LIST.push(row);
      });

    }

  }

  selectRow($event, dataSource) {
    if ($event.checked) {
      this.RESPONDENTS_LIST.push(dataSource);
    }
    else {
      for (var i = 0; i < this.RESPONDENTS_LIST.length; i++) {
        if (this.RESPONDENTS_LIST[i] == dataSource) {
          this.RESPONDENTS_LIST.splice(i, 1);
          break;
        }
      }
    }
  }

  openProjectList() {
    this.dialog.emit(true)
  }
  report(): void {


    var temp = this.user;
    this.user = this.RESPONDENTS_LIST
    let printPages = [];

    for (var i = 0; i < this.reportSettings.numberOfpagesToPrint.length; i++) {
      if (this.reportSettings.numberOfpagesToPrint[i].print) {
        printPages.push(this.reportSettings.numberOfpagesToPrint[i].number)
      }
    }

    let reportParts: Array<any>;

    let directorInfo = []
    directorInfo = [
      new TextRun
        (
          {
            text: "  Contact Person – " + this.data.bmxRegion,
            font:
            {
              name: "Calibri",
            },
            size: 20,
          }
        ),
      new TextRun
        (
          {
            text: "  " + this.data.bmxRegionalOffice[0].name,
            bold: true,
            font: {
              name: "Calibri",
            },
            size: 20,
            break: 1
          }
        ),
      new TextRun({
        text: "  " + this.data.bmxRegionalOffice[0].title,
        font: {
          name: "Calibri",
        },
        size: 20,
        color: "7F7F7F",
        break: 1
      }),
      new TextRun({
        text: "  P ",
        bold: true,
        font: {
          name: "Calibri",
        },
        size: 20,
        break: 1
      }),
      new TextRun({
        text: this.data.bmxRegionalOffice[0].phone.trim(),
        font: {
          name: "Calibri",
        },
        size: 20,
      }),
      new TextRun({
        text: "  E ",
        bold: true,
        font: {
          name: "Calibri",
        },
        size: 20,
        break: 1
      }),
      new TextRun({
        text: this.data.bmxRegionalOffice[0].email,
        font: {
          name: "Calibri",
        },
        size: 20,
        style: "Hyperlink",
      }),
      new TextRun({
        text: "",
        break: 1,
      }),
    ];

    reportParts = [];
    var t = this.reportSettings;

    reportParts.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new ImageRun({
            data: Buffer.from(this.biLogo, "base64"),
            transformation: {
              width: 120,
              height: 75,
            },
            floating: {
              zIndex: 5,
              horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.CHARACTER,
                align: HorizontalPositionAlign.LEFT,
              },
              verticalPosition: {
                relative: VerticalPositionRelativeFrom.PARAGRAPH,
                align: VerticalPositionAlign.OUTSIDE,
              },
            },
          }),
          new ImageRun({
            data: Buffer.from(this.companyLogo, "base64"),
            transformation: {
              width: this.compWidth,
              height: this.compHeight,
            },
            floating: {
              zIndex: 5,
              horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.COLUMN,
                align: HorizontalPositionAlign.RIGHT,
              },
              verticalPosition: {
                relative: VerticalPositionRelativeFrom.PARAGRAPH,
                align: VerticalPositionAlign.OUTSIDE,
              },
            },
          }),
          new TextRun({
            break: 4,
            size: 24
          }),
        ],
      }),
      new Paragraph({
        spacing: {
          before: 200,
          after: 200,
        },
        children: [
          new TextRun({
            break: 4,
            size: 24
          }),
          new TextRun({
            text: "",
            bold: true,
            font: {
              name: "Calibri",
            },
            size: 24,
          }),
        ],
      }),
      new Table({
        width: {
          size: 95,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell(
                {
                  width: {
                    size: 50,
                    type: WidthType.PERCENTAGE,
                  },
                  children:
                    [
                      new Paragraph({
                        children:
                          [
                            new TextRun
                              (
                                {
                                  text: "  Brand Institute, Inc.",
                                  bold: true,
                                  font:
                                  {
                                    name: "Calibri",
                                  },
                                  size: 20,
                                }
                              ),
                            new TextRun
                              (
                                {
                                  text: "  200 SE 1ST STREET – 12TH FL",
                                  font: {
                                    name: "Calibri",
                                  },
                                  size: 20,
                                  break: 1
                                }
                              ),
                            new TextRun({
                              text: "  Miami, FL 33131",
                              font: {
                                name: "Calibri",
                              },
                              size: 20,
                              break: 1
                            }),
                            new TextRun({
                              text: "  P ",
                              bold: true,
                              font: {
                                name: "Calibri",
                              },
                              size: 20,
                              break: 1,
                            }),
                            new TextRun({
                              text: "305 374 2500",
                              font: {
                                name: "Calibri",
                              },
                              size: 20,
                            }),
                            new TextRun({
                              text: "  E ",
                              bold: true,
                              font: {
                                name: "Calibri",
                              },
                              size: 20,
                              break: 1,
                            }),
                            new TextRun({
                              text: "info@brandinstitute.com",
                              font: {
                                name: "Calibri",
                              },
                              size: 20,
                              style: "Hyperlink",
                            }),
                            new TextRun({
                              text: "",
                              break: 1,
                              size: 28,
                            }),
                          ],
                      }),
                    ],
                  borders: {
                    top: {
                      style: BorderStyle.NIL,
                    },
                    bottom: {
                      style: BorderStyle.NIL,
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "D9D9D9",
                    },
                    right: {
                      style: BorderStyle.NIL,
                    },
                  },
                }),
              new TableCell({
                width: {
                  size: 50,
                  type: WidthType.PERCENTAGE,
                },
                children:
                  [
                    new Paragraph({
                      children: directorInfo
                    }),
                  ],
                borders: {
                  top: {
                    style: BorderStyle.NIL,
                  },
                  bottom: {
                    style: BorderStyle.NIL,
                  },
                  left: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "D9D9D9",
                  },
                  right: {
                    style: BorderStyle.NIL,
                  },
                },
              }),
            ],
          }),

        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "",
            break: 2,
          }),
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "",
            break: 5,
            size: 20,
          }),
          new TextRun({
            text: "BRANDMATRIX",
            color: "FFFFFF",
            bold: true,
            font: {
              name: "Calibri",
            },
            size: 60,
          }),
          new TextRun({
            text: "TM",
            color: "FFFFFF",
            bold: true,
            superScript: true,
            font: {
              name: "Calibri",
            },
            size: 52,
          }),
          new TextRun({
            text: " Report",
            color: "FFFFFF",
            bold: true,
            font: {
              name: "Calibri",
            },
            size: 60,
          }),
          new TextRun({
            text: "Project " + this.data.bmxProjectName,
            break: 1,
            color: "FFFFFF",
            font: {
              name: "Calibri",
            },
            size: 48,
          }),
          new ImageRun({
            data: Buffer.from(this.cover, "base64"),
            transformation: {
              width: 849,
              height: 282,
            },
            floating: {
              zIndex: 5,
              horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.LEFT_MARGIN,
                align: HorizontalPositionAlign.LEFT,
              },
              behindDocument: true,
              verticalPosition: {
                relative: VerticalPositionRelativeFrom.PARAGRAPH,
                align: VerticalPositionAlign.OUTSIDE,
              },
            },
          }),]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "",
            break: 9,
            size: 20,
          }),
        ]
      }),
      new Paragraph({
        pageBreakBefore: true,
      }),
      new Paragraph({
        text: "TABLE OF CONTENTS",
        style: "MySpectacularStyle",
        shading: {
          type: ShadingType.SOLID,
          color: "0021A5",
          fill: "0021A5",
        },
        border: {
          top: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          bottom: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          left: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          right: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        spacing: {
          before: 200,
          after: 200,
        },
        alignment: AlignmentType.RIGHT,
        children:
          [
            new TextRun({
              text: "Page",
              bold: true,
              font:
              {
                name: "Calibri",
              },
              size: 24,
            })
          ],


      }),

      new TableOfContents("Summary", {
        hyperlink: true,
        headingStyleRange: "1-5",
        stylesWithLevels: [new StyleLevel("TOC1", 1)],
      }),
    )
    if (this.reportSettings.displayCompletionStatus) {
      reportParts.push(new Paragraph({
        children: [
          new TextRun({
            text: "BRANDMATRIX",

          }),
          new TextRun({
            text: "TM",
            superScript: true,
          }),
          new TextRun({
            text: " COMPLETION STATUS",
          }),
        ],
        pageBreakBefore: true,
        style: "MySpectacularStyle",
        shading: {
          type: ShadingType.SOLID,
          color: "0021A5",
          fill: "0021A5",
        },
        border: {
          top: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          bottom: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          left: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          right: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        heading: HeadingLevel.HEADING_1,
      }),
        new Paragraph
          ({
            spacing: {
              before: 200,
              after: 200,
            },
            children: [
              new TextRun({
                text: "This section details who participated in the BrandMatrix",
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
              new TextRun({
                text: "TM",
                superScript: true,
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
              new TextRun({
                text: " COMPLETION STATUS",
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
              new TextRun({
                break: 1.5
              }),
              new TextRun({
                text: "Percentage of participants who have completed the BrandMatrix",
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
              new TextRun({
                text: "TM",
                superScript: true,
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
              new TextRun({
                text: "TM = " + ((this.completed / this.total) * 100).toFixed(2).toString() + "%",
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
              new TextRun({
                break: 1.5
              }),
              new TextRun({
                text: "(" + this.completed + " out of " + this.total + ")",
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
            ],
          }),
        new Table({
          rows: [
            new TableRow({

              children: [
                new TableCell({
                  shading: {
                    fill: "FF4616",
                    type: ShadingType.CLEAR,
                    color: "auto",
                  },

                  width: {
                    size: ((this.completed / this.total) * 100),
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      spacing: {
                        after: 200,
                      },

                      children:
                        [
                          new TextRun
                            (
                              {

                                font:
                                {
                                  name: "Calibri",
                                },
                                size: 20,
                              }
                            ),
                        ],
                    }),
                  ],
                }),
                new TableCell({

                  shading: {
                    fill: "B6B6CE",
                    type: ShadingType.CLEAR,
                    color: "auto",
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                      ]
                    })
                  ],
                }),
              ],
            }),
          ],
          width: {
            size: 95,
            type: WidthType.PERCENTAGE,
          },
        }),
        new Paragraph
          ({
            spacing: {
              before: 200,
              after: 200,
            },
            children: [
            ],
          }),
        this.createTable(),
      )
    }

    if (this.reportSettings.displayOverallRanking) {
      reportParts.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "OVERALL RANKING",

            }),
          ],
          pageBreakBefore: true,
          style: "MySpectacularStyle",
          shading: {
            type: ShadingType.SOLID,
            color: "0021A5",
            fill: "0021A5",
          },
          border: {
            top: {
              color: "0021A5",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
            bottom: {
              color: "0021A5",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
            left: {
              color: "0021A5",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
            right: {
              color: "0021A5",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph
          ({
            spacing: {
              before: 200,
              after: 200,
            },
            children: [
              new TextRun({
                text: "",
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
            ],
          }),

      )
      if (this.reportType === "multipleChoice") {
        reportParts.push(this.overallMultipleChoice(printPages),)
      }
      else {
        reportParts.push(this.overallTable(printPages),)
      }
      if (this.reportSettings.OverallRankingWithRespondents)
        reportParts.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "BY PAGE",
              }),
            ],
            pageBreakBefore: true,
            style: "MySpectacularStyle",
            shading: {
              type: ShadingType.SOLID,
              color: "0021A5",
              fill: "0021A5",
            },
            border: {
              top: {
                color: "0021A5",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
              bottom: {
                color: "0021A5",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
              left: {
                color: "0021A5",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
              right: {
                color: "0021A5",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph
            ({
              spacing: {
                before: 200,
                after: 200,
              },
              children: [
                new TextRun({
                  text: "",
                  font:
                  {
                    name: "Calibri",
                  },
                  size: 20,
                }),
              ],
            }),
          this.byPage(printPages),
        )
    }

    if (this.reportSettings.displayResultsByRespondents) {
      reportParts.push(new Paragraph({
        children: [
          new TextRun({
            text: "BY PART",

          }),
        ],
        pageBreakBefore: true,
        style: "MySpectacularStyle",
        shading: {
          type: ShadingType.SOLID,
          color: "0021A5",
          fill: "0021A5",
        },
        border: {
          top: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          bottom: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          left: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          right: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        heading: HeadingLevel.HEADING_1,
      }),
        new Paragraph
          ({
            spacing: {
              before: 200,
              after: 200,
            },
            children: [
              new TextRun({
                text: "",
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
            ],
          }),
        this.byRespondant(printPages));
    }

    if (this.reportSettings.openEndedQuestions) {
      reportParts.push(new Paragraph({
        children: [
          new TextRun({
            text: "COMMENTS BY NAMES",
          }),
        ],
        pageBreakBefore: true,
        style: "MySpectacularStyle",
        shading: {
          type: ShadingType.SOLID,
          color: "0021A5",
          fill: "0021A5",
        },
        border: {
          top: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          bottom: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          left: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          right: {
            color: "0021A5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        heading: HeadingLevel.HEADING_1,
      }),
        new Paragraph
          ({
            spacing: {
              before: 200,
              after: 200,
            },
            children: [
              new TextRun({
                text: "",
                font:
                {
                  name: "Calibri",
                },
                size: 20,
              }),
            ],
          }),
        this.commentTable(printPages));

    }

    this.doc = new Document({
      features: {
        updateFields: true,
      },
      styles: {
        paragraphStyles: [
          {
            id: "MySpectacularStyle",
            name: "My Spectacular Style",
            basedOn: "Heading1",
            next: "Heading1",
            quickFormat: true,
            run: {
              bold: true,
              color: "FFFFFF",
              font:
              {
                name: "Calibri",
              },
              size: 22,
              shading: {
                type: ShadingType.SOLID,
                color: "0021A5",
                fill: "0021A5",
              },
            },

          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 26,
              bold: true,
              color: "999999",
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120
              },
            },
          },

          {
            id: 'TOC1',
            name: 'toc 1',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            paragraph: {},
            run: {
              font: 'Calibri',
              bold: true,
              color: '#1C205C',
              size: 22
            },
          }

        ],
      },

      sections: [
        {
          properties: {
            page: {
              margin: {
                left: 500,
                right: 500
              }
            },
          },
          footers: {
            default: new Footer({
              children: [
                new Table({
                  width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                  },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell(
                          {
                            width: {
                              size: 50,
                              type: WidthType.PERCENTAGE,
                            },
                            children:
                              [
                                new Paragraph({
                                  alignment: AlignmentType.LEFT,
                                  children:
                                    [
                                      new TextRun
                                        (
                                          {
                                            text: "Project: ",
                                            font:
                                            {
                                              name: "Calibri",
                                            },
                                            size: 20,
                                          }
                                        ),
                                      new TextRun
                                        (
                                          {
                                            text: this.projectName,
                                            bold: true,
                                            font:
                                            {
                                              name: "Calibri",
                                            },
                                            size: 20,
                                          }
                                        ),
                                    ],
                                }),
                              ],
                            borders: {
                              top: {
                                style: BorderStyle.NIL,
                              },
                              bottom: {
                                style: BorderStyle.NIL,
                              },
                              left: {
                                style: BorderStyle.NIL,
                                size: .5,
                                color: "D9D9D9",
                              },
                              right: {
                                style: BorderStyle.NIL,
                              },
                            },
                          }),
                        new TableCell(
                          {
                            width: {
                              size: 50,
                              type: WidthType.PERCENTAGE,
                            },
                            children:
                              [
                                new Paragraph({
                                  alignment: AlignmentType.RIGHT,
                                  children:
                                    [
                                      new TextRun({
                                        children: ["-", PageNumber.CURRENT, "-"],
                                        bold: true,
                                        font:
                                        {
                                          name: "Calibri",
                                        },
                                        size: 20,

                                      })
                                    ],
                                }),
                              ],
                            borders: {
                              top: {
                                style: BorderStyle.NIL,
                              },
                              bottom: {
                                style: BorderStyle.NIL,
                              },
                              left: {
                                style: BorderStyle.NIL,
                                size: .5,
                                color: "D9D9D9",
                              },
                              right: {
                                style: BorderStyle.NIL,
                              },
                            },
                          }),
                      ],
                    }),
                    new TableRow({
                      children: [
                        new TableCell(
                          {
                            width: {
                              size: 50,
                              type: WidthType.PERCENTAGE,
                            },
                            children:
                              [
                                new Paragraph({
                                  alignment: AlignmentType.LEFT,
                                  children:
                                    [
                                      new TextRun
                                        (
                                          {
                                            text: "11/22/21",
                                            font:
                                            {
                                              name: "Calibri",
                                            },
                                            size: 20,
                                          }
                                        ),
                                    ],
                                }),
                              ],
                            borders: {
                              top: {
                                style: BorderStyle.NIL,
                              },
                              bottom: {
                                style: BorderStyle.NIL,
                              },
                              left: {
                                style: BorderStyle.NIL,
                                size: .5,
                                color: "D9D9D9",
                              },
                              right: {
                                style: BorderStyle.NIL,
                              },
                            },
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          },

          children: reportParts
        },
      ],
    });


    Packer.toBlob(this.doc).then((blob) => {
      saveAs(blob, this.data.bmxProjectName + ".docx");
    });

    this.user = temp;
  }
  cover = `/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIA6QKLAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQIDBQYEB//EAEEQAAIBAwIEAgcFCAIDAQABBQABAgMEEQUhEjFBUWFxEyIyUoGR0SMzQqHBFENicoKSseEVUwZUokTwYxYkNKP/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAcF/8QAKhEBAQACAgIDAQEBAQEAAgIDAAECEQMSITETQVEiMgRhQjNSFCNxBfD/2gAMAwEAAhEDEQA/APkYAP335QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAASACAAAAAAEEkBQAFULIqTkIsACKAEICQAFWpycKkZLo8m5TTSa5Pc0hstPqcdHhfOO3wOnHfOnk/6sNyZMepU/ZqLyZ46c3CcZLmnk21aHpKUo91safk9yck1dtf8ANl2x636b6MlKKlHk1k8Wp09o1F02ZfTanFScHzj/AIPTVgqlOUH1Rv8A1i4T/wDqzaWEnCSkuaeUb2nNVKcZLk1k0Mk4yafNbGy0urmEqb5rdeRzwurp6efHc3E6pS4qcaiW8dn5Gsi3Fpp4a3Rv5xU4SjLk1hmhqQdOcoS5p4Gc1drwZbnVv7eoqtGM11R59UpcdDjS3hv8DBpNbDlSb57o2bSaaaynsy+453+MnOHQWdb01CMuvJ+Zo7im6NaUH0ex6tKrcFZ03yny8zGN1Xfknabj36jR9LbPC9aO6NGdKaG+o+guJJey94jOfacWX022m1/TWyy/Wj6rM13RVe3lDrzXmabTa/oblZfqz2Zv4lnmJlOuTmGsbPmjc6PX46TpSfrQ5eR49Voejr+kivVnv8Tz2tZ0K8ai6Pdd0Y9V2v8AUdHVgqtOUJezJYZzVanKlVlTmvWi8HTRalFSi8prKZrNZoZjGvFbraX6MtjOF+kaLcYk6EntLePmblY3T5M5OnJwmpReGnlM6a1rKvQhUj15rsyRrKfbRX9u7a5lH8D3j5GTTLn9nuVxP1J7S+ptNVtv2i2cor14brx7o59Ga3LuOvRo9atvR1VWivVnz8Ge3Sbn09vwSfrw280eu4pRr0ZU58pL5AnhzVvWlQrRqQ5xefPwOqoVY1qUakPZksnJ1acqNSVOftRZs9EuuCp6Gb9We8fBmWnt1i19NQ9JBevD80aA6853VbX9nr5gvs57x8PAVY2+k3f7TbpSf2kNn4+J6rmjG4oSpz5SXPscxZXEravGpHlya7o6mlONSnGcHmMllMjTlK1KVGrKnNYlF4Njol56Gr6Go/s5vZ9mevWbT01L0tNfaQW/ijQIix2qOf1qy9BV9NTX2c3ul0ZsNHvf2mjwTf2sFv4rue6rSjWpSp1FmMlhkaclQqzo1Y1KbxKLyjrbO4jdUI1Ydea7PscreW0rWvKnPlzi+67mbTL12dfLy6UtpL9SVY6HUrON5buL2mt4PxOUlGVOcoTTUk8NM7SElKKlF5T3TNVrdj6aLr0l9pFesveRGmDQ7/0clb1peo/Yb6PsdCcMjpNF1D9ogqNV/axWz95fUi415Na0/wBFN3FGP2b9pL8L7+Rq6c5QnGcJNSTymuh2jipRcZJOL2afU5jVLB2dTihvRk9n28GRbG+0q+jeUfWwq0faX6nrrUoVqUqdRZhLZnGW9advVjUpPEkdZp95C8o8cdpr2o9mSxqVzuoWU7Otwy3pv2Zd/wDZjsrmpa1lUpPfqujXY6y4oU7ik6dVZi/y8Uctf2dSzrcE94v2Zd0Q9Oqsrqnd0VUpvzj1TL3VvTuqDpVVs90+qfc5GyuqlpWVSk/NdGjrLK7p3dFVKb3/ABRfNMy3K5e+tKlnV4KizF+zJcmRaXNS1rKpSeH1XRrxOtuKFO5pOnVjmL/LxRy+oWNSzqYl61N+zPv/ALIrptPvaV5SzDaa9qD5o9FWnCrBwqRUoPmmcVb1p0KsalKTjNcmdRpmpQvI8MsQrLnHv5GbGpWo1PTJ2snOnmdHv1j5mvjJxknFtNbpo7ZpNNPDT6Gk1LR3vVs14un9CKy6XrKlileNJ8lU7+ZvU00mnszgnlNp7NGy03VKtpiMs1KPut8vIzYsroNQ06jeLL9Sr0ml/nuc5eWdaznw1Y7PlJcmdTaXNK6p8dGakuq6rzM1SnGrBwqRUovmmZacXSqTpVFOnJxkuTRvrDXE8QvFh++lt8UYb/RGk52jyufA3v8ABmmcZQbjNOMls01yJVju6U41IKUJKUXyaeSK9ClcU+CtBTj2ZxtpeV7SeaM2l1i90/gdBY61RrJRuPsp9/wv6GbFYLzQ5LMrSXEvclz+ZqKlKdGfBVhKEl0awdrFqSTi00+qK1qNOtHhqwjOPZozWtuNp1J05qVOTjJcmng21prlenhV0qse/Jme60KEnxWs+B+7LdfM1NzZXFs/taUlH3luvmZrcu3UWuq2tfC9J6OXae358jYxeVlHAI9Ftd17d/Y1ZR8M7fIzYadxhNYe6Z5a2m2lbLlRjF947f4NNb69VjhVqcZrutmbK31q0qY4nKm/4l9DFWbYqugwbfoa0o+E1k8tTRbuHs8FTylj/Jv6NelWWaVSE/5XkzoxWplXISs7ml7dCovHhyjEk4yw00/E7ZCUYyWJJNeKM2NzJxiB2DtLaftUKX9qKvS7OXOhH4NoxY33jkQdW9Isn+6a/qf1I/4az/65f3MmjvHKg6taPZf9bf8AUyy0qyX7hfGT+o0d45IHYxsLSPK3p/GOTPCjTh7FOEfKKQ0d3GU7etU+7pTl5RbPVS0m8n+64V3k0jrANJ3aCjoM/wB9XivCKye6jo9pT9qMqj/iZ75SjBZk1Fd28Hkr6paUs5rKT7Q3Km7XqpUoUo4pQjBdorBc0dfXlyoUX5zf6I1txqd3XypVXGPaGxNkxtdPcXlC3++qxi+3N/I1V1rvNW1P+qf0NDnfcyUqNStLhpQlN9khtqYyL3N1XuXmtUlJdui+BhSbeEbi10OrNp3M1Tj7sd39DcWljb2q+ypri957sFykaGz0e4r4lUXoofxc38De2en29ok6cMz9+W7PWeK81G3tU1OfFP3I7v49is7te01t/q1G2zGH2tXsnsvNmmvdVr3WYp+jpv8ADHr5s14WYfr0Xd5Wu58VaWUuUVyXwMVKnOrUUKUXKT5JHvsNJrXOJVPsqXdrd+SOhtbSjaw4aMcd2+b+JFuUnpr9O0eFLFS6xOfNR6L6m0nzJnONODlNqMVu2+hz+p6y5N07TKXWp1fkY5P8pjvKvdqOpU7ROMcTre728zmbivUuKjqVZOUn+RRvLy92zY6bpc7nFSrmFH85eR5666keWys6t5U4aaxFe1J8kdRZWlK0pcFJb9ZPmzLRpQo01TpRUYrojFeXdK0pcdV+UVzY9MW7ZLitToU5VKslGKOY1LUKl5PCzGintH9WY7+8q3lTiqPEV7MVyRjtbepc1VTpRy+r6LzDUmvalCjOvVjTpRcpM6rTbGFlS29ao/al+i8CdPsqdnTxH1qj9qXc9FarCjTdSpJRgubZYlu0VqkaVOVSo1GEVltnLanfTvKvVUo+zH9WW1O/nezwsxor2Y9/Fnlt6NS4qxp0o5kwsmvJa29S5rxp0lu+b6JdzrLK1p2lFU6a85dWyun2cLOjwx3m/al3MtxXp29GVSq8RX5lZt2pe3ULSg6lR/yx6tnJ3NedxWlVqPMn+Re+up3dd1J7LlGPZFtOs53lfhjtBbyl2RGpNM2kWDu6vHUX2MXv4vsdQkkkksJdClGlCjSjTprEIrCR59TvFaUsLerL2V28WMspjN0xxy5LrF49avHGLt6MsSftyXRdjSRXJRXP8y025Nyk8t7tm50Sxxi5qr+RP/J5cuS5P0uPix4Zv7ezSrL9loZkvtZby8PA9VerCjSlUqPEYrJflz5HOave/tNX0dN/Ywe38T7mUxlzryXdxO5ryqz5vkuy7Hq0iz/aa3HNfZQe/i+x5LahO4rxp0+b69kdXb0YW9GNOmsRj+Yjpnl1moyI0Wu3nHP9npv1Yv1/F9jYareK1oeq/tZbRXbxOYbbbbeWaY48fuslCnKtVjTprMpPCOstKEbahGnDkub7vua/Q7P0VP09RevNbJ9EbSc404Oc3iKWWxDky3dR5dVu/wBmtnwv7Se0fDxOZM19cyuriVR7LlFdkejSLT9puFKa+yhu/F9jLrjOmO62ui2voLf0k19pU38ke+vVjQpSqTfqxWSyNDrl36Sp6CD9WD9bxZb4cpLnk8NerKtWlUn7Unk2ehW3FN15r1Y7R8Wau2pSr1o04c5P5HWUacaNGFOCxGKwYkduTLU1F8458jmtSuf2m5lJexH1Y+RtNauvRUPRQfr1PyRoI5bwuZMk4cf/AKr3aRbftFynJZpw9aX6I6c8em237NbRi/be8vMtf3KtbaU/xcorxE8MZ3vlqNTrdz6W49FF+rT5+Z5LKg7m4hTXJ7t9kedtttt5bOh0O29Fb+lkvXqcvBGPdd8rOPHw2UUopRisJbJGn1643jbxf8Uv0Rtq9WNGjOpP2YrJylapKrVlUn7UnljKuPDju7Tb03Wqwpx9qTwdbRpxpUoQh7MVg0+g2/tXEl/DH9WbmTUYuUnhJZbEi8uW7prdduOCjGjF+tPd+RpKcXOcYxWW3hIyXld3FzOo+Tey7I92hW/pK7rSXqw2Xmc75rrP/wCvBurWiqFCFOP4Vv4s8mt3HorVU4v1qm3wNhy5nMajcftF1OSeYL1Y+QviOPFj2y3WCOW8JZZ1VlQVvbQp9Ut/M0ei2/pbtTa9Wnv8eh0ZmRrmy89Xh1iv6K0cU/Wqer8Opz68D1arcenu5Yfqw9VfqW0ih6e8i2vVh6z/AEMXy6YTphut5YUP2e1pwx62MvzMerV/Q2kkn60/VX6ns6HP6vX9NduK9mn6q8+v/wDPAzfDhxzvluvGdNp9H0FpCD9rm/M0el0fT3cE16sfWZ0hzdObL6ePVa3orSST9afqr9TQHt1iv6W64E/VprHx6mPTaPpruCa9WPrMzXTjnTDdbuxo+gtYQftYzLzMWq1vRWskvan6v1PYaPWK3pLrgXs01j49TnY48c7ZeXiJRCBLHtWC2ZBJiqsCE+pJD0+BgA+yvlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUCCSAAAAAABgAQACtAAAtEkgkiAACgAAGeyqejrrPKWzMAEurtMse01W8NXf0+CtlcpbnvtqnpaMZdeT8yl7T9JQbXOO6O+U7R+fxZfHyarxWdX0daLfLkzcnPo3FlU9JQWfajszHHfp6P+nH/wCnj1GlwVeNcpf5MNtU9FWjPoufkbO7peloSiua3RpzOc1dt8OXfDVdCmmk1yZrtUpYlGquT2Zm06r6Shwt+tDb4Hor01VpSg+q2fibv9Rxxvx5+WkpTdOpGceaeToKc1OEZR5NZOdknFtNYaeDZ6TWzF0pc1ujnjfp6OXHc2tqtHMFVS3js/I1kW4yUk8NPKOhnFThKMuTWGaCtTdKrKEuaYyn2cWW5pv7aqq1GM11W/gzBqdD0tDiXtQ3+HU8mk1+Go6UntLdeZty+4xf4ycyb7T6/preLbzKOzNRfUPQXEopeq94+RbTq/oLhZ9iWzMTxXfKdsdxuryiri3lDrzXmc8002ns1zOniafVqHBVVWK9WfPwZcozx5fT06PccVN0ZPeO8fI2M4xnCUJLMZLDOZoVXRqxqR5p/M6WlONSnGcXlNZRI1lNVzdxSlQrSpy5p8+57dHuPR1vRSfqT5eDPVq9v6SiqsV68OfijSxeOXMz6bl7R10H0NBqtt6C44or7Oe68H1RtNPuf2i3Un7cdpGW8oK5t3B7PnF9mW+Ul1Wgs67t7iNRcuTXdHT05KcFKLzFrKZyUouEnGSxJPDRt9Fuv/zzfjD6GW6ya1a8dP08F60fa8UaWLaezw1yOtaTTT3TOb1G2drcNL7uW8WSrK32mXSurdN/eR2kvEy3dvG5oSpy580+zOcsLl21dTXsvaS7o6iElOClF5i1lMi+nJ1ISp1JQmsSi8NG00S74J+gqP1ZP1X2fYzazaekh6emvXivWXdGjTw8ojbszntWs/2er6Smvspv5PsbPSrz9pocMn9rDaXj4nqr0oVqUqdRZiwOXtq0retGpTfrRfzOrta8LihGrDk+a7PscrdW87as6c1y5Puu5n0u8dpW9bLpS2ku3iZbjf6laK7t3H95HeD/AEOXnFwm4yTUk8NM7GLUopp5T5M1etWPpYu4pL7Re0l1Xcgw6Hf+jkretL1H7DfR9jfnEHR6LqH7RBUaz+1itn7y+pLGpXk1mw9FJ3FFfZv2kvws1cJShNSg2pJ5TR2UkpRcZJNPZp9TmtUsHaVOKGXRk9n28CK3mlXyvKXrYVaPtL9T2VqUK1OVOosxksNHGUa06FWNSlLE0dZp17C8o8UdpraUezJWpXPajZTs62HvTfsy7/7Mdnc1LWsqlJ7rmujXY6yvRp3FKVOqsxf5HLX9nUs63DPeD9mXdA06myuqd3RVSm/OPVMyXNCnc0XTqrMX814o5CzualrWVSk9+q6Ndjq7G7p3dFTpvf8AFF80zNjcu3NX9nUs6vDPeD9mXRlLS5qWtZVKUsPqujXZnW3FGncUnTqxzF/kcvqFjUs6mHmVN+zP/wDnUyOl0++p3tLMNpr2ovmj1VacKtNwqRUovmmcTQrVKFVVKUnGa6nUaXqULyPBLEKy5x7+RG5Wo1PTJ2knUp5nQ79Y+Z4IycWnFtNcmuh2+E001lPZo0Wp6PjNW0WV1p/Qis2l6wp8NK7aUuSn0fmbpPqjhd08PmbLTdUqWuIVMzo9uq8iWLK3moabSu05L1KvSS6+Zzd1a1rWrwVotdn0Z1trXp3FNToyUl/gyVqVOvTcKsVKL6Mw0463rVKFRTpTcZLqjodP1mnVxC5xTn734X9Dwaho1SlmdtmpT58P4l9TVcnh8yVY7xNNJp5Rhu7OhdxxWhv0ktmjl7DUa9o0oy4qfuS5fDsdFY6nb3WEnwVPcl+nczWmnvdHr0Mypfa0/Bbr4GtWzwzukeS70+3usupDE/fjsyK5u0va9q/sajS917r5G8s9dpVMRuYunL3lujX3ei16WZUWq0PDZ/I1koyhJxlFxktmmsNGWo7qjVhVgpU5xnHunkyo4SjWqUZ8VKcoS7p4Nta65WhhV4xqrutmZsWN1caZa195U1CT/FDY1tfQai3t6sZeElhnvttXtK2E6no5dprH58jYwkpJOLTT6oy05CtZXNDerRmkuqWV80YEdyjFWtaFb72jCT743+ZmrMnGp4eUeuhfXVLaFeol2byjd1dEtZ7w46b8HlfmeWpoE191Xi/5lg51uWMdLW7uHtOE/wCaP0PXT1+a+8oRf8ssHhno95HlCM/5ZL9TDKxuoe1b1PhHJmtTTe09eo/jo1F5NM9EdctXzVVecf8AZy7pzj7UJR81glMxWpjHVrWbN/jkv6WT/wAxZf8Aa/7X9DlSDO16R1b1iy/7JP8ApZR63aLk6j8onLgbOkdJLXrdezTqvzSX6mGev+5b/OX+jRRjKXspvyRmjaXE/ZoVX/Sxtese+prtzL2IU4/Btnmq6neVOdeS/l2/wWp6VeT/AHOF3k0j00tCrv7ypTivDLYP5jUznKbzOUpPu3kqdHS0GivvatSb8Nke2jp1pR9mhFvvLf8AyNJ3jlKNCrWeKVOcv5UbC30S5qYdRxpLxeX+R0ySSwlhAaS51rLfRbalh1OKrL+J4XyNlThCnHhpxjGPZLB57i/trf7yrHiX4VuzV3Gvc1bUv6p/Qqatb1tJZZr7vVrahlRl6WfaHL5nPXN5XuPvqjkvd5L5HnJtqY/r33mq3NxlKXoqfaP1PAe200y5ucOMOCHvT2N1Z6Pb0MSqL0s+8uXyC7kaKz0+vdv7OHDD35bI39jpVC1xKS9JU96S2XkjYJYWFyMN1d0bWHFWmo9l1fwKxcrWc8N/qVC0Ti3x1fcj+vY099rNasnCgnSg+v4n9DVvdhZh+vTe3ta7lmrL1VyiuSPLGnOrUUKcXKT5JI99hpla7xLHBS99rn5dzf2tnRtI8NKPrY3k+bOfJ/lrcjX6do8aWKl1ic+aj0Xn3Nv0IlKMIuUmoxXNtmi1LWHLNO0eF1qfQ4HmvbqWpU7ROEcTre70Xmc1XrVK9R1KsnKTKN5bb3b6my0zS53OKlXMKP5y8jPtvUjz2FlVvKmIbQXtSfJHT2drTtKShSXm3zbMlGnCjBQpxUYLkkYr68pWlPiqPf8ADFc2Vi3a9xXp29J1KslGK/M5bUb6peVMv1aa9mP/APOpS9u6t3V46r2XsxXJEWlrUu6qp0l5voitSaVtqNS4qqnSjmT/ACOosLKnZ0sR3m/al3L2NnTs6XDTWZP2pPmzLcVoUKUqlWXDFBm3aK9aFClKpVlwxRymo3s7ytxP1aa9mPb/AGW1G+neVcv1aa9mP/8AOphtbapdVlTpLLfN9Eu7DUmk2dtUuqyp015vokdXZ20LWjGnSW3V9WyLG0p2lFU6ay/xS6tmS5rwtaLqVH/t9kZyymM2uON5LqK3lzCzouct5cox7s5evVnXqyqVHmTZe7uZ3VZzn8F0SMmn2crurjlTXtS/Q8mWVyu6/T4uPHixZdJsf2mp6SovsYv+59jo0sbdCtOEadOMIJKKWEkePVb5WtLgg81pLbw8Qxbc68utX3Cnb0n6z9trp4GkSbaSWW9sCTbbbeW98m70Sx4cXFZbv2E+niHbxxx69Ls1aUMyx6WW8n28D1V6sKFKVSo8RiXe3Pkjm9Xvf2mrwU39jB7eL7lcZLnXlu7iVzXlUnzfJdkerSLL9prcdRfYwe/i+x5bWhO5rxpw5vm+y7nVW9GFCjGnTWIxXz8Sx05Mus1GY0WuXnFL9npvZe2/Hse7VbxWtD1fvZbR8PE5jLby2231LWOPH7rLSpyq1Iwgsyk8I6uyt421vGlHpzfdmv0Sz9HT9PUXryXqp9EbWc1CDlNpRistvoNHJlu6jzaldfsts2n9pLaKOYy28vm+pnv7p3Vw6nKK2iuyMulWn7VcLiX2UN5ePgZvl1wkwm62uiWnoaPppr16nLwRsak40qcpzeIxWWyVy2NLrl1xSVvB7R3n59hfDlJeTJr7mvK4rzqS6vZdke7Q7X0tb0016kHt4s11GnKrVjTgsyk8I6u2oxt6EacOUVz7mZNu3Jl1moznN6tdftFzwxf2dPZeL6s2mrXX7PbcMX9pPZeC6s51PcmX4nDj/wDVerT7Z3VzGH4FvLyOqWEkktjw6Ra/s9tmS+0nu/Dsj0XdeNtbzqS6cl3Yk1GOTLvlqNXr1zxSVvB7LeXn0RrLelKvWhTh7UngpOcqk5Tk8yk8tm60G24YSuJreW0fLuc/dd7rjxbWlTjSpxpwXqxWEa/W7n0dFUYv1p8/I2M5KEJTk8KKy2crd13cXE6j6vZdl0LlXHix7ZbqsYuUlGKbbeEjqrKgra2hTXNLLfdmn0O39JWdaS9WGy8zfGZPtebLd08er3HoLRpP16nqr9TnD1anc/tF1Jp+pH1Y/UvpFv8AtF0nJepD1n+iMXzXXCdMd1u9Mt/2e0imvXl60vMtqNx+z2spJ+u/Vj5noRz+s3Ppbr0cX6lPb49RfEcMJ3z8vAdJo9D0NopNevU9Z+XQ0mn0P2m6hDHq85eR1C7GJHTny/8Aljva6t7WdTqlheZy+ctt8zY65ccdWNGL2hu/M8VnRdxcQprk3v4Ixk1xY9cd1u9FoejtfSNetU3+HQ9l1WVC3nUfRbeZeKUYpJYS2wajXK+ZQoRfL1pfoZrjj/ebVtuTbe7e7N7otHgt3Ua9ao/yNLbUnWrwpx5yeDqYxUIqMViKWEjDtzZamlbiqqNCdR/hWTmJNyk29292bXW6+0KKf8Uv0NSYq8OOptJJUsjLulElSxiqLZlirJW6Ir4IAD7I+UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABKIAEgAgAAAAADIJIKoAAoWRUsBIAIAAAAAK9enVOGo4PlLl5mxNHGTjJSjzW6N1SmqlOM1yaO3HfGng/6cNXt+tTc0/RVpR6c15GbT6vBW4X7Mtvj0M+oUuKkprnH/Brk8M55Trk9HHfl49V0BqL6l6Ou8L1Zbo2VtU9LRjLryfmUvaXpKLx7Ud0dMp2jz8WXx56rX2dX0NeLfsvZm6OeNxp9b0tBJ+1HZmOO/Ttz4/8A08up0eGoqiW0tn5nloVHSqxnHozdV6Sq0ZQfXk+zNFJOLaaw1s0Zymrt04su2Oq6OElOKlF5TWUeDVaOYqrHmtn5DSa3FF0pPdbryPfOKnFxksprDNe45f4yc9GTjJSi8NPKZ0FtVVajGa6812Zoq9N0asoS6P5nq0qv6Or6Nv1Z8vMxjdXTtyTtNx7tRoemt217cN0aQ6Y0eo0PQ18xXqS3X0LnPs4svpstMuPS0FGT9eGz8V0PTcUo16MqcuvJ9jQWdd29eM/w8mvA6KDUo5T2e6Eu4ZTrXNTi4TlCSxJPDNlo1xhuhJ7PeP0J1e3zivFeEvqayEnCSlF4aeUzHqusvaOp25Pkznr+3dtcOK9h7x8jd2ldXFCM1z5NdmRf26ubdxXtx3iW+WcbqtNYXDt66k/Ye0vI6WDTW26fI5HdZT2aN1o11xR9DN+tH2fFdjM/G8p9q6za/wD6ILwn9TVwlKElKLxJPKZ1UoqcXGSzFrDRzd7bu2ruD3jzi+6JYuN+m/sbhXNBTXtcpLsyb23V1QcHtLnF9maLTrp2tdN/dy2kv1OkTTSaeU+TC+nJyjKEpQmsSTw0bfRLzD/Z6j2e8G/8E6zacUf2imvWXtruu5p02mmnhrdMy3PLsjndVs/2atxQX2U+Xg+xtdMu1dUVxNekjtJd/E9VejCvRlSqLKf5CkcvbV5W9aNSnzXTuux1NvWjcUY1Kbyn+Ry1zQnbVpU6nNde6PRpd47WtiW9KT9ZdvEjTd6jaK7o4WFVjvF/oc3KLjJxkmpLZpnXJppNPK6M1us2PpIuvSXrr2kuq7kajFol/wADVvWl6r9hvp4G+OJOi0a/9PFUaz+1itn7y+pKryazYeik69GP2b9pL8L+hq4SlTmpwbUk8prodlKKlFxkk09mmc1qlg7WfFBN0ZPZ9vAit3pd9G8pYlhVo+0u/ieypThWpyp1FmMtmjjaFadCrGpTliUeR1Wn3kLylxR2mvaj2I1K5/UbKdnVw96b9mXf/ZitLipa1o1KTw1zXRrsdbXowuKTp1Y5i/yOW1GznZ1uGW8H7Mu5B1Njd07uiqlN78pRfNMyXNCnc0nTqxzF/l4o4+zualrWVSk9+q6NHWWN3TvKKnTe/wCKL5pkrcrm7+yqWdXhnvB+zJdTHa3FS2qqpSlhrmuj8Dra9GFxSlTqxzF/kcxqNhUs6m/rUn7M/r4kNadJp99TvKWY7TXtR7HqqU4VabhUipRfNM4qhWnQqxqUpOMlyZ0+l6lC7jwyxCsuce/ijNjUrU6npk7VupTzOh36x8zXxk4yUotprk10O3aTTTWU+aNFqejuOatom11p/T6EaZ9L1hVOGldNKfJT6PzN2cGtnh8za6Zqs7bFOtmdH84+RmxZW31HTKd2nOGKdb3uj8znLi3q21TgrRcX07M6+hWp16aqUpKUX1RNxQp3FNwqwUo+PTyI05C2uKttUU6M3F/k/M6TTtXpXGIVsUqr78n5Gp1DSalvmdHNSl+a8zWkqu9R5L3TaF3lyXBU9+P69zn9P1etapQqfa0uze68mdJZ3lC7jmjPfrF7NGLGo5u906vaPMo8VP348vj2PIjuOa35GuvNHoV8ypfZVPBbP4EVq7LV7i3xGb9LT7Se68mb6z1O2ucJT4Jv8Mtmczd2Fxa/eQzD347o8yeURY75GO4taFzHFenGfZvmvicpZ6pc2uFGfHD3Z7o3dprdvVwqydKXd7r5mdKw3Ogp5dtUx/DP6msuLK4t/vaUlH3luvmddSqRqR4qcoyi+qeUXRmtbcOjNQr1aLzSqTg/B4Opr6da1950oqXeOzNfW0Bc6FbHhNfqjNalYKGuXVPCqcFReKw/yNlQ16hL72nOD8N0aatpV5S/dOa7wef9nkcZQfDOLi+zWDNakdnR1G0q+zXgvCXq/wCT2QlGSzFprumcEi8Jyi8wk4vungxV071FkcVS1C7p44bip8Xn/J66etXkcZnGXnFfoYrUxdYHCMvajF+aObhr1x+KlSfllfqZ46/L8Vun5T/0Zq6rffs9B86NN/0ofstv/wBFL+xGnj/5BHrbv+//AEX/AOfh/wCvL+7/AEYrWq237NQXKjT/ALUWjSpx9mnFeSNP/wA/Hpby/v8A9FH/AOQPpbfOf+gda3wOdlr1b8NGmvPLMU9bu5cvRx8o/UmzpXTg5Gpqd5PnXkv5Ul/g81StVqfeVJy/mk2Nr0dhVvLal95Wpp9uLc8VbW7WHscdR+CwvzOYC3eENr0jc19erS2o04Q8XuzX1725r59JWm12TwvkTRsLqt7FCeO7WF+Z76Gg1Zb1qsYLtFZYXxGmMlGhVrSxSpym/BHT2+kWlLDcHUfebz+R74xjCPDBKKXRIaS5uettErTw681TXZbs29rp1tbNOEOKa/FLdnrzhZfI8NzqtrQyuP0ku0N/zKzu17zBc3dC2jmtUUX26v4HP3es3FXMaWKUfDn8zWSbk25Ntvm2xtZh+txea3UnmNtH0cfee7NROcpzcpycpPm28syW9vWuJ8NGm5Pw5I3VlocY4ldS4n7keXzI14xaa1ta11Phowcu76L4m/sdGpUMTr4q1O34V9TZ06cKcFGnFRiuSSK161OhDjqzUI92Vi5Wr+CPDqN/RtPbfFUxtBczW3+tTnmFqnCPvvm/LsaOo3Kbcm23zbOfJf5axx/Xpvr+teS9d8NPpBcjzU4SqTUKcXKT2SR6rDTq148xXDSzvN/p3OksrKjZwxSj6z5yfNnndLZHg03R408VLrEp9Ic0vPubcSkoxcpNKK5tmi1LWM5p2jwuTqfQMea9upanTtE4QxOt26LzObr1p16jqVZOUn1MbeW23ls2emaXO5xUrZhR7dZD23qR5tPsal5UxH1aa9qb6HUWttStaShSjhdX1fmZKdONKChTioxXJI899e0rOnxVHmT9mK5srFu2S6uKdrSdSrLC6Lq/I5e/val5VzL1YL2Y9jHeXVS7qudV+SXJCytal3VUKS26yfJBqTSLW2qXVZU6S36vol3OqsbSnaUVCmst+1LrJk2dpTtaSp0lv1fVsy161O2pOpVlhL/+YRnLKYzdXHG8l1CvVp29J1Kjwl//ADCOYvrud3W4pbRXsx7Im/vJ3dXiltBezHsUtLad1WUKa830SPJllcruv1OLjnHE2dtO6rKEOX4pdEjp7ejChSjTprEV+ZW1t6dtRUKa831bF3cwtqLnUfklzbIxllcrqKX93C0o8T3m9ox7nMVqk61WVSo8ylzZe6uJ3NZ1Kj3fJdEuxm02yld1d8qlH2n+gdccZhN1l0iw/aJ+lqr7KL2XvP6HREQhGEFGCSitkkeDVr5W1Pgpv7aX/wAruVxtudebW7/Gbei9/wAbX+DTKLk0orLbwkQ223l8ze6LYcEVXrL1n7CfRdw7eMI9Wl2StKPrYdWW8n28D0XFaFClKpUeIxRkbSWXsjmtWvXdVeGD+yg9vF9zTjjLnfLzXdxO5ryqVOb2S7LsenSLL9qrcdRfYwe/i+x5rWhO5rxpU+b5vsu51VtRhQoxp01iKXz8St55dZqMq5bGk1u94pfs9N7L22uvge7VLxWlB8LXpZbRXbxOZby223nuKnFjvzV6UJVKkYQWZSeEjq7K3ja28accN85PuzwaHZ+jh+0VF68l6q7I2s5KEXKTxFLLfYkhyZbuo8+oXStbdy/G9orxOYcm5NyeW3lsz6hdO6uHP8C2ivAvpdo7q4WU/Rx3k/0M3y64SYY7raaHa8EPTzXrTXq+CNpOUYQlKbxFLLYSwkksI0+uXe6t6b8Z/QenGb5MmuvbiVzcSqPlyiuyPVo9r6e445L7Onv5vojwU4SqVIwgsyk8I6uzoRtqEKcenN92Z0755dZqPQuZz+t3Xpq/ooP1Kf5s2ep3X7Nbvhf2kto/U5rruTK/TPDj/wDVZ7OhK5uIU47Z5vsjq4RjCEYQWIpYSNfotr6Ch6Sa+0qb+S6Hur1Y0aMqk36sUJNRnly7XUa3XbnhgreD3lvLy7GmhCU5xhFZk3hIVqsq1aVSftSeTa6FbcUncTW0do+fcx7rt448W2s6Ct7eFKPRbvuzz6vc+gtnGL9ep6q8urPa3jd8jmdQuf2m5lNewto+RcvEcOPHvluvMdPpdt+zWkU168vWl9DTaPbenulKS+zp7vxfRHSIxJ9t82X/AMsF9cfs1tOp+LlHzOXbbbbeWe/Wbn01x6OL9Snt5vqeewt3c3MKf4ecvIxfLfHOmO63eiW/orb0kl69Tf4dD23NVUKE6kuUV8y0UksJYRptduOKcaEXtHeXn0F8Rwk+TJrJzc5ylJ5lJ5Zu9Ct+GnKvJby2j5f/AM/waa3pSrV4U485PHkdZShGnTjCO0YrCMR25stTrCpNU6cpyfqxWWcvWqOrVnUlzk8m11244acaEXvLeXkainFznGMVmUnhGMjhx1N1t9Coe3Xkv4Y/qbeUlGLk3hJZbMVvSVGjCnHlFfM8es1/R0FST9apz8jNjlf/AOzNqLmq69edR/ie3gjH0IJRivZPCSSPAJmFixKIQM1pYgkkxofBAAfZHykAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEoEEkAAAAAADACoABVAABZEkEkAAAAAAPbp1XnTfmjxE05OE4yjzTLjdXbHJh3x03TSaafJmnrU3Sqyg+j28jbwkpwUo8msnl1GlxQVRLeOz8jrnNzbx/8APn1y637Y9Oq8FTgfKX+TaHPxbTTRu7ep6WlGXXr5k479On/Rhq9o1l5S9FWaS9V7oWVb0NdN+y9mbC9o+lovC9aO6NQYynWu3FlOTDVdCazU6PDUVWPKXPzPTp9b0lHhftR2+BnrU1VpSg+q/M3Z2jhjbx5+Wlo1HSqxnHmmb+nNVIRnF7NZOenFwk4yWGnhmx0mvzoyfjE543Xh6OXHc3GTVKHHTVSK9aPPyNUnh5XM6NpNNNZTNFd0XQrSj+Hmn4DKfacWX03NlXVegpfiWzXiTeUPT0JR/Fzj5mo0+v6Cusv1JbP6m9LLuJlOt8OaaabTWGjbaRccUPQye8d4+Rg1W34JqtFerL2vM8VKbpVIzi/Wi8ox6rt4zxdNOKnFxksxa3Rz11RdCtKD5c0+6N9b1Y1qUZx5PoYdRtvT0cxX2kd14+BcpuMYXV8tdplz6CviT+zns/DxN+nucmbzSrn0tL0U368OXijMrplPt59YteCfp4L1Ze14M8FKcqdSM4PEk8o6acI1acoTWYtYaOcuqEretKnLpyfdEsaxu/Do7OvG4oRnH4rsymoWyuaDS9tbxZpdMuv2aviT+zls/DxOjTWMrkPaeq5NpxbTWGtmjcaLd5X7PUe/4H+hXWbT/wDRTX86X+TVRk4yUovDTymR09uu57NZTOe1O0dtWzFfZS3j4eBttPuldUU395HaS/Uz3FGNxRlTnyfXs+5KTw5y1ryt60akOa5rujqLetGvSjUpvKf5HK3FGVvWlTmt4/n4nq0u8dtV4Z/dSe/h4kabrUrNXdH1cKrHeL/Q5qScW1JYa2aZ2EWmtnlGr1ix9JF16S9de0l1Xcixi0a+4Wreq/VfsN9PA3kWcWdBpF/6eKpVX9rFbP3l9SNR5tYsPRSdekvs37SX4X9DWQnKnNSg8Si8po7FpSi4ySaaw0zm9UsXaz4oZdGT2fbwDTdaXfK7pYlhVY+0u/ij2VIQq05U6izGWzRx1CrOhVjUpyxJdTqdPvIXdLijtNe1HsZqxz+o2U7Oth705ezL9DFa1521ZVKTw1+Z1tejC4pSp1VmLOX1CznZ1eGW8H7Mu5FdNYXcLuipw2a2lHqmZrihTuKMqdWOYv8ALxOPtLmpa1lUpPD6ro12OrsbyneUuODxJe1HqiVqVzd/ZVLOrwy3g/Zn3MdtcVLaqqlKWGvkzrrijTr0nTqx4os5jULCpZ1N/WpP2ZfoyGnR6ffU7ylmO017Uex66lOFWm4VIqUXs0ziqFadGoqlKTjJcmjp9L1KF3HgliNZc49/Ilal21Gp6bO1k508yod+sfM8EZOMlKLaa5NdDtmk001lPoaLU9IceKraJuPN0+3kRdPRpWrqoo0rppT5KfR+ZujhFsza6Zq07fFOvmdLo+sSWNStrqWl07rM6eKdbv0l5nO16NS3qunVi4yXc7CjVhWpqdKSlB8miLm2pXVPgrRyuj6ryMtOUtLqra1OOjLHddH5nSafqlG7xCX2dX3W+fkaTUNLq2uZx+0o+8ly8zwJizY7s11/pVG5zOn9nV7pbPzRq9P1mpR4YXGalPv+JfU6C3uKVxT46M1JeHTzMNuUu7StaTxWg0nykuT+JipylCSlGTjJcmnjB2soRqQcZxUovmmjUXuiRlmdpLhfuS5fBkVjsdcnDEbqPHH3lz/2b62uaNzHiozUl1XVHF16NWhPgrQlCXj1FKpOnJSpycZLk08GbFju+aw+R4LrSLa4y4L0U+8eXyNXZ65UhiNzH0kfeWzN5aXtvdL7Gom/dez+RmtOeutIuaG8Y+lh3hz+R4VlPD2Z3KMFxZ29z99SjJ9+T+ZFclRrVKMuKlOUJeDwbS21yvDCrRjVXfkzNcaCnl21X+mf1NZXsLq3z6SjLh7x3RlqOittZtau05Spy/iW3zNlSqQqR4qc4yj3i8nBpmSE5QkpQk4vungzYsd6hKEZx4ZxUl2aycjQ1a8pYXpeNdprP+zYUf8AyCX76gn4xlj8jNitrU0yzq5boRi/4fV/weapoNB/d1KkfPDLUdbtJ44nOn/NH6Htp31rU9ivTb8ZYMVZtqZ6BVX3deD/AJk19TE9FvI8lCXlL6nSRaksxaa8C6MWNTKuVel3sedCXwaZX9iulzt6vwi2dci6M1uZOOVrcLZ0Kq/oZZW9b/pqf2s7BF4sxY13cara4fKjV/tZZWV0+VtV/sZ2YM6Xu5COm3kuVvL47GWGj3kucIx85I6oDSd65yGg137dWmvLLPTT0Cmvva8pfyrH1N0YalzQp/eVqcfOSLo7V5aWkWdPnTc33lJnspUKVFfZU4Q/lWDx1dXs6fKo5vtGLPJV16C+6oSfjJ4Bq1uyG1FNtpJdWcxW1m7qZUXGmv4V9Tw1a9Ws81ak5/zPJNr0rqa+qWlHnVUn2hua2416Tyreko/xSeX8jRmaha167+xpSl4pbfMbXrItcXle4f21WUl25L5GA3FtoVWWHXqRgu0d2ba1021t8ONNSkvxT3Y0vaRzlrYXNy16Om1F/ilsjcWmiUqeJXEnUl7q2RuDFXr0qEeKtOMF4sumblavThCnBRpxjGK5JLBFSpClByqSUYrq3g013rqWY2sMv35/Q01xcVbifFWqSm/HkgTG1ur3XIxzG0jxP35cvgjSV61SvU4603OXiUhCVSSjCLlJ8klk29lok54ldPgj7q5ka8YtVRo1K81ClBzk+iN3Z6NCnJTumpy9xcl59zb29Clb0+CjBRj4dSK84005TkoxS3bZjk/ynbfoSSSSSSXJI817e0bSOassyfKK5s1l/rXOFovD0jX+EaSc5Tm5TblJ7ttnBqY/r1X+oVryWJPhp9ILl8e55YQlUmoQTlJ7JLqemxsK15L1FiHWb5HSWNjRs4fZrM3zm+bI1bI8Gm6RGnipdJSn0hzS8+5uCJtRTlJpJc2+hotS1jOado8LrU+n1DHmvbqWpwtYuFPE63bpHzOarVZ1qjnVk5TfVlW8vLfM2mmaVK4xVr5hS6LrL/QbkkebTrCpeT2zGkvan9DqLahTtqSp0o4ivzL04RpwUIRUYrZJGG9vKdnT4pb1H7Mf1JllMZupjjeS9YyXVxTtKTnVe/RdX4HM3t3UuqvFN4S9mPREXNxUuarnVeX0XRFrKzqXdThhtFe1LojyZZXK7r9Xj4pxYqWltO6q8FNeb6JHTWltTtaShTXm3zbLWtvTtqSp0l5t82RdXFO2pOdR7dF1bIxlncvELq4hbUnUqPbolzbOYvLmpdVnOb26LokTeXVS6q8dTl0j0SJsrSpd1eGG0V7UuiRHXHGYzdTYWk7urwx2gval2OmoUoUacYU1iKIt6ELekqdJYivz8WUvbqFrRc57vlGPdlcssrldRTULyNpSzzqS9mP6nL1ZyqVJTm25SeWy9xWnXrSqVHmT/I9WmWLu6nFPKox5vv4IOuMmE3WXR7D00lWqr7OL2XvP6HQsrGKjFRikorZJGv1a/wD2eHoqT+1kufuo0423OvNrd/nNtRf87X+DTQi5yUYpuTeEkPPmb7RrD0UVXrL7R+yn0QdbrCPTplmrShvh1Zbyf6HouK0LejKpUeIxXzMjaSbbwl1OZ1W9d1VxH7qHs+PiVxxlzvl5ruvO5ryqVOb5Lsux7NHsnc1eOovsYc/F9jx2lvO5rxpw6832Xc6y3owoUo06axFFdM8us1GVGl1y84n+zU3svba/wezVLxWtDEWvSy2iu3ic0228t5b6kqcWP3V6cJVJxhBZk3hI6uxto2tvGmt3zk+7Nfoll6OH7RUXryXqrsu5tpSUYuUnhJZbEhyZ78Rgv7pWtu5veb2iu7OYnJznKUnmTeWzPqN07q4cvwR2ivAtptq7uuov2I7yfh2MXy64TpN1stDtOGP7RUXrPaHl3NtKSjFyk8JbtkJKKSisJbYNTrl3hfs9N785/QvqOXnkya+/uXdXDnyjyivAzaTa/tNwnJZpw3l4+B4acZTmoRWZN4SOqsLdWtvGmscXOT7sxrbvnl0x1HqNFrl36Sr6CD9WG8vFmz1G6VrbOS9t7RXicu22228tvcZX6Y4cN/1WW3oyr1o04c5P5HV0acaNKNOC9WKwjXaHa+jpenmvXmvV8EbKrONOnKc3iMVlkk0zy5drqNfrVz6Kh6GL9epz8EaKO+EllsvdV5XFedSXV7Lsj3aHbekrOtJepDl4sxfNdsZOPHy3GnW/7NbRg/be8vMajc/s1tKSfrvaPmek5vVbr9ouWov7OGy8e7Ll4jhhj3y3Xjzl5fM6LRbb0Nv6SS9epv5LoabTbf8AabqMWvUW8vI6hcsLpyMSOnNl/wDKtxWjQoTqS5RWfPwOWqTlVnKc3mUnlmx1y545xoRe0d5eZr7alKvXhThzk8eRnLy1xY9ZutvoNviMriS3fqx/Vm3lJQg5yeIpZbK0oRp04wgsRisI1uuXPBSjQjznvLyJfDh55M2quazr3E6kvxPZdkbDQ7fiqSrSW0do+Zq4Rc5RjFZk3hI6q1oq3t4U4/hW77s56d+XLrjqMzeEc1f1/wBouZzXs8o+RttXuPQ23BF+vU2+HU0BnJnhx/8ApJJCJMPQsgQmT4GKqSSpZGVSiSqLczCvgoAPsb5SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASiABIAIAAAAAAyCSCqAAKFipYIkAEUAAAABXu06rzpPzR7ZJSTT3T2NNTm6c4yjzTNxCSnBSXJ7nbju5p+f8A9GHXLtPtqK1N0qrg+nI9OnVeCrwPlLb4mXUKXFT44848/I1yeGc7OtenCzlw8ugNRfUvRVm17Mt0bG1q+moqX4ls/Mi6pemouP4lujplO0efjy+PPVa21rehrKXTk/I3aeVlcmc91Npptbjh6OT3jy8jnhfp358NztFNUo8q0V4SPBCThJSi8NPKN9KKnBxlumsM0dem6VWUJdPzGc1dtcOfaare29VVqUZx6812Ziv6HpqOYr147rx8DwaZX9HV4JP1J/kzcFl3HPKXDLw5s3Wl3HpaXo5P14fmjxalQ9FV44r1J/kzz29V0asZx6dO6Meq73WePh0FWEatOUJey0c/Wpyo1ZQlzX5nQU5xqQjODzFrKPJqdv6Wl6SK9eH5ouU2xx5dbqvLpdz6Kr6Ob9Sf5M3hypvdMufT0eGT+0hz8V3Jjfp0zx+48eq23oqnpYL1Jc/BnjoVZUasZwe6Z0VWnGrSlCazGRz1xRlQqyhPmuvczlNNYZbmnR29aNalGcOT/Ixajaq5o+qvtI7x+hqtMuvQVeGb+znz8H3OgTyi+0v81yjTTwzdaNd8cfQVH6y9h912MOr2uH6emtn7S7eJrIycJKUXiSeU0Z9OnuOtkk000mn0Od1C1dtW23py3i/0NzYXSuqKlymtpLxMlzRjcUZU58nyfZipLpz1pcStqynDya7o6ahVjWpRnTeYs5avSlQqypzWGvzPXpl47arwzf2Unv4PuZbbfUrRXVHMcKrH2X38DnWnFtSWGtmjrYtPDW6fU1msWXGnXpL117SXVdwsqmjX3Di3qvZ+w308DeHGI6DSL/08fQ1X9qls/eX1I08mr2Po5OvRX2b9pL8L+hracpQmpRbUk8prodfJKSaayns0c7qli7WfHDLoye3h4Eqtxpd9G7pcMsKrHmu/ie2pCNWnKFRKUWsNHH0Ks6NSNSm8Sj1Oo0+8hd0sraa9qPYjUaHUbOVpVxu6UvZl+hhtq07eqqlN4kvzOrrUoV6UqdVZizmdQsp2lXD3g/Zl3IrpdPu4XdHijtJe1HszNXo07ilKnVjmL/I5C2r1LeqqlJ4a/M6mwvKd5S4obSXtR6ozWo53ULKpZ1cS3g/Zl3MVtXqW9VVKUsSX5nXV6MK9J06seKL5o5jULCpZ1M7ypN7S/RgdFp19TvKWY+rUXtR7HqqQjUhKFSKlGWzTOLo1Z0aiqUpOMlyaOm0zUYXceGWI1lzXfyI3K1Wp6bO1k508yod+sfM8EZOMlKLaa3TR2rSkmmsp9DRanpLinVtU3Hm4dvIhp6dK1dVVGldNKpyU+j8zcnCdTb6Zq0qGKdxmdLkn1j/oljUrZalpcLnNSliFb8peZz1alOhUdOrFxmujOxpVI1acZ05KUXyaKXVrSu6fBWjns1zXkZXTlrO8q2lTipS26xfJnTafqNG8SSfBV6wf6dzn7/Tqto28cdLpNfr2PFFtNNNprk0RZ4d55mqv9Hp1szt8U6nb8L+h4tO1qUMU7vMo++ua8+50FGrCrBTpyUovqmZrbjq9Crb1HCtBxl49RQrVKE1OlNxl3R2FajTrwcK0FOPiaS+0WcMztXxx9x8/9k2PRY63GWI3S4X78eXxRu6c4zipQkpRfJp7HCyjKEnGcXGS5prDRntbqtay4qNRx7ro/gZsaldnVpU60HCrCM4vo0ai70OLzK1nwv3JcvmTZa5TqYjcx9HL3lvH/RuKc41IqVOSlF8mnky1HH3FtWtpcNanKPi+T+JjTae3NHbSjGcXGcVKL5prKZrbnRberl0W6UvDdfIitZaavdUMKUvSw7T+puLbW7erhVeKlLx3XzNJdaVdUMvg9JH3obnjZGo7ulUhUjxU5RnHvF5MhwdGrUpS4qU5QfeLwbS31u5p4VThqx8Vh/MzYsdFXs7avn0tGDb64w/meCtoVGX3NScH2e6FvrtvParGdJ/NGyoXVCtj0VWEs9E9/kZqtBV0S6h93wVPJ4/yeSpaXFFZqUakV34dvmdii5itSuGLo7Opb0a33tKE/GUUzzz0mzn+64X/AAyaJWtuXhKUXmLafgz0U725h7NxVXhxM3U9Ct37FSrHzwzDLQH+C4Xxh/sxWpY8dPVb2PKu/ik/0M8dZvF+OL84os9BuF7NWk/PK/Qj/hLtcvRvykYrUsZI63d//wBN/wBJkjrl17tLP8r+p5/+GvF+CL/qRZaRer92v7kYrU09H/N3fal/aVes3j5SivKJSOkXj/dx/uRkWi3b6U15yMVr+WOWrXsv32PKK+hilf3UudxU+EsHtWhXL5zpL4v6GWOgTft3EV5RyDeLTTqTn7c5S83kodFDQaK9utUfkkj0U9Gs4c4Sn/NL6DR2jlTLSoVav3VOc/5Y5Oup2dtT9ihTT78OWegaTu5Wlo93U5wUF3lI91DQYrDr1m/CCx+ZvClWrTpLNWcYL+J4LpO1rzUNNtKOOGipPvLc9iWFhcjW19Ztae0JSqP+FfU11fXa0tqNONNd3uwatdG2kst4SPBc6ta0Mrj9JLtDf8+RzNe5rV3mtUlLwb2+RhJtqYfrb3OtV6mVRSpR782aypOVSTlOTlJ9W8me1sbm5+7pPh957I29rocI4dzNzfux2XzC7kaGnTnVmo0oynJ9Esm3s9DqTxK6lwL3Y7s3tGjTox4aUIwXgi7eE29kis3NhtrWjbR4aMFHu+r+Jnbwss1l5rFvQzGl9rNe7y+ZorzULi72qTxD3I7IJMbW7vtZo0Mxo4q1PD2V8Tnr27rXVTirTb7R6L4GNGwtNIrV2pVvsqfjzfwOfL6dMZMWspwnUmoQi5SfJI3lhoqWJ3by/cX6s2lraUbWHDRgl3fV/EzSajFuTSS5tnnLl+EYqEVGKSiuSSwYLy8o2kOKrLfpFc2a2/1qMMwtPWl775LyNFUqTqzc6knKT5tspMf169Q1CreNpvhpZ2gv17njhCU5qME5SeySPTZWVa8nimsRXOT5I6SysaNnH1FxTfOb5smttWyPDpukRpYqXSUqnSHNLz7m4IbUU3JpJbts0eoas5t0rRtLrU+g8RiS5XUe3UNRhb8UKfr1fyj5mgq1J1ajnUk5SfNshRb6Nm003SZ1sVLiLjT6Lk5f6PFycst81+txcU4cf/Xm0+wqXcs+zSXOX0OjoUYUKSp0opRRlhRUIKMUoxXJLoYL25p2sPWfFUfKKOXzYfpZlndRF5dU7Wk51Hv0j1ZzN3c1Lqq51H5LokZa8ncVHOq3KT/Iz2Ni7mpiMUoL2pY5EvNHfHg6TdeOytKl3V4aa2XtS6I6e1to29JU6cWl1b5tmehRhb01ClHEV+ZW6uIW1JzqPyXVs5X/AKL9Rzyx7XTFdVY21JzqfBdWc3dTq3NV1Kkl4LokZrq4nc1XOo/JdEi9laTuquI7QXtS7F+XL3XfHhxwm6w2GnVLqrhPFNe1I6WlbqlTjCmkorZIyUKUKNNQprEUYr27ha0uKW837Me5n58vpxyx73UebUrl2tL1UnVl7K/U5moqk5uc8yk3ltnrrVJ1qkqlR5kz16ZYu5qcc1ilF7+PgdPmv26zhxwm6po+nupJV60XwL2Ytc338jemdJJJJYS7Gt1a+VGLo0n9o1u/dRcf+j/xwvHeS+Gu1q/427ejL1V7bXXwNTCMpzUYJuTeEl1M7hF84o3mk6bGjH01RP0klsvdX1Ok5sft0y4/jjJptnG0opPDqS3k/wBDPc14W9GVSo9l+ZmlFRTbaSW7bOZ1W5ndVvVT9FH2V38TpOTG+q8848sruvLc153NeVSpzfTsux7NIsv2mrx1F9jB7+L7Hks7adzXVOCx3fZHV0KUKFKNOmsRianlvPLrNRlXI0mt3uX+z03svba/we3VL1WtHEd6s9ort4nNN5eW8tis8WO/NXpQlUnGEFmUnhI6qwto2tuqa3lzk+7PDoln6OHp6i9eS9VPou5tZSUYuUmkkstski8me7qMF9cxtbdze8ntFd2cxOUpycpPMm8tno1C6d3Xcl7EdorwGnWrurhR/dreb8DN8uuGPTHdbHQrTH/+RUW/KCf+TctpJtvCXVlYpRioxSSWyRqtbvOGP7PTfrS3n4LsPTj55Mng1G6d1cOS+7jtFeBOmWrurlJr7OO8voeSCcpKMVmT2S7nVadbK1tow243vJ+JjW6755dMdR6UkkktkaXXbrLVvB7Lef6I2V/cq1t5TeHLlFd2cvKTnJyk8yby2Mq58OG72q1GnKrUjTgsyk8I6u2oxt6MaUOUVz7s1uh2vDB3E160to+Xc2s5KEXKTxFLLZMYnLlu6jx6tdegt+CL+0qbLwXVnPGW9uHc3Mqj5corsj1aPa+nuOOSzTp7+b7Gb5rtjPjx3W20m2/ZrZcSxUnvLw8DPeV1bW86j5rku7Mpz+s3Xpq/o4v1Ke3mxfEcMZ3y8vDOTnNyk8yk8tm80K24abryW8to+RqLKg7m4hTXJ7t9kdXCKjBRisRSwkYkdebLU6xM5xp05Tm8Riss5W5rSr151Jc5P5I2muXWEreL3e8v0RqKcJVJxhBZlJ4RnI4cdTtW00K346rryXqw2j5m9/wYbWjGhQhTjyit33Z5tXufQ2vBF+vU28l1J6ccreTLw1OoXH7RdSkn6q2j5HnRVEo5V7JNTSwIJRlUliqJRmqkkgIwsWJIQM2K+DgA+wvlIAAABOH2GjaATh9hwsvWp2iAW4WOF9y9aneKgtw+I4R0p3xVBbhQ4UXpU+SKgvwocKHSnyRQF+FDhQ+OnyRQF+FDhQ+OnyRQFuFDhQ6U+SKgtwjh8SdKvfFUFuHxHCx0p3xVBPCxwsnWr2iATh9iCaXYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUCCSAAAAAAAAKgAFUAAFwVRYiAACgACh7dOq86bfijxExk4SUo808lxurtz5MO+Om7aysPkzT3FL0VVx6c15G1pTVSmprqYr2j6SllL1o7o7ZztNvFwZ/HnqvJY1vRVcN+rLZm3OfRtrGt6Wlhv1o7PxMceX07f9GH/1Hm1CjwVPSR9mXPzPNRqOlUjOPNG4rU1VpyhLk/yNNOLhNxlzRnOau46cOfbHrW9pzVSEZx5NZPNqND0lL0kfaj+aPPplfhk6UuUuXmbRG/8AUcbLx5ueN3YV/T0VxP147Px8TWX1D0NXZepLdfQpa1nQqqS5dV3Ryn816cpM8dxvK9KNalKEuv5GhqQlTnKE9mnhnQRkpRUovKaymeLU7fjh6WC9aPPxRrKbc+LLV1WLSrjgn6Gb9WXLwZtjmVs8o3thceno7+3HZ/UmN+m+TH7jXajb+hq8UV6kuXgzBb1pUK0akOa6d0b6tSjWpShPk/yNBWpypVJQnzRnKab48u01XSUakatOM4PMWjz6lbftFHiivtI8vHwNdpd16Gp6Ob+zl+TN4a9xmzrXLm60i744+hqP1o+y+6PPq1rwS9PBeq/aXZ9zXQk4TUovEk8pnP1XbxlHVySlFqSyns0c9f2ztq2Fl05bxZurK5VzRUltJbSXZl7mhG4ounP4PszVm2ZdVz9pcStqynHlya7o6WlUjWpxqU3mLOXrUpUakoTWJI9el3n7PU4Jv7KXPwfcw3Z9trqNorqlmO1WPJ9/A59pptNYa2wdWnnDTyma3VrLjTr0l6y9pLr4irKpo97w4t6r2/A3/g3SOON/pF96ZKlVf2qWzf4l9SNPNq1j6OTrUl9m/aS/C/oa6EpQkpRbUk8proda0mmmsp7NHPalYu2nxwy6Mnt4eBKsrcabfK6p8MsKtHmu/ij11IRqQlCaTjJYaZyVKpKlUjOm8Si9mdLYXkLullbVF7USNNHqNnK0q9XSl7Mv0MNvWnQqRqU3iSOprUoVqUqdSOYs5u+s52lXD3pv2ZdyK6Kxu4XdLijtNe1HsZ61KFek6dWOYs5K3rTt6qqUniS/M6awvIXdPMdpr2o9iNNBf2c7Oph7037MjFb1p0KqqUpcMl+Z1lalCvSlTqxUovoc3qFjO0nneVJ8pfoyDoNOvoXlPK9Wovaj2/0empCNSEoTipRaw0zjKVSdKpGdOTjNcmjptM1GF3FRniNZc10fiiWNStVqWmztW508yo/nHzNfGTi1KLakt00dphNNNJp7YNHqekuGatqm483Dt5EV6dK1aNVRpXTSqclPpL/ZuUcI9mbfTNWlRxTuG50+Sl1iSxqVstS0uFzmpRxCt+UjnqtKdGo4VYuM1zTOypzjUgpwkpRfJoxXdpSu6fDVjv0kuaI1pzNje1rOeaT9V84vkzprC/o3kfUfDPrB8zm7+wrWcm5Lip9Jpbf6PNCUoSUoNxkuTTJYS6d1s1h7p9DT6ho0Z5qWmIy9x8n5djDp2tcqd55Kol/k3sJRnFShJSi+TT5mW/bi6lOdKbhUi4yXRmW0uq1rPiozce66P4HV3VrRuocNaCfZ9V8TQX2kVrfMqOatPwW6+BBtbHWKNfEa2KVTx9l/E2q3Rwh7bHUq9phRlxU/cluv9EsaldPdWlG6hitBN9JLmviaO80atSzKg/Sw7fiNpZapb3OE36Oo/wAMv0ZsDLTiGnGTUk01zTM1tc1refFRqSg/Dk/gdXc2lC6jitTTfvcmviai60KpDMrWfGvdlsyVWaz17lG6p/1Q+huba6o3CzRqRl4J7r4HGVaVSjPhqwlCXZrBEZOLTi2muqM2LHeIw3Fnb3C+2pRk+/J/M5u11i6o4UpKrHtPn8zbW2t29TCqqVJ+O6+ZmtMdxoMXvb1XH+Ge/wCZrq2mXdDOaTlHvDc6mjVp1o8VKcZrvF5MiMq4eScXhpproyUztatClWWKtOE/NZPFW0W0qZ4FOm/4X9SVqVoqF9c0cejrzSXRvK+TPdR126htONOfmsP8i9TQai+5rxf8yweWppV5T39DxLvFpma1G1o/+QU3j0tCS/lln6Hrpa1Zy5zlD+aL/Q5adGrSeKlOcP5otFUZqu2p39rU9m4p/GWP8nohVhP2Jxl5PJwaLmLF075FonBxqVI+zOS8mZoXdxHlXqr+tmK1MXcosjiVfXS//RV/uZdahd/+xV/uM1qYu0izIcT+3XT/AP0Vf7mW/bLl87is1/OzFa6u1IlOMV60kvNnEyrVJe1Um/OTMb3M7Xo7Sd5bQ9qvSX9SPPPV7OH71yfZRZyYG16R0dTXqK+7pVJeeEeSrr1eX3dOnBeOWzUwpzm8QjKT8Fk9VLTbyp7NCS/m9X/I2vWQrald1faryS7R9X/B5JScnmTbfdm4o6FWlj0tSEF4bs9lHQ7aG9SU6j88IaO0jmj1ULC5r/d0ZY7vZfmdVQtLeh91ShF98b/MzjTNzaC30GTw7iql4Q3/ADNnbada2+HCkpSX4pbs9U5RhHim1Fd28HguNXtaKajJ1ZdoLb5lTdrYlK1WnRhxVZxhHu2c7c63cVMqio0l35s1s6k6snKpOUpd28k2sw/W/utcpwzG3g6j957I013e3F0/taj4fdWy+RghCU5KMIuUnySWTaWmh3NbEqq9FDxWWTbUkjVGws9JuLjEpr0VN9Zc/gjobPSqNthwp5n7892e5UX1aJc8Z9n9X1GtstOt7TDhHiqe/Ld/6PTU5i6uLe1yqtTM/djzNLeX07jMY5pw7J7v4nHk5sNajeHBnl5eq+1Oha5jn0lVfhj+rOfvL6vePE2+DpCPIzqlBcoL5GwstNrXOJY4KfvNf4R5vl36jvP+eY+bWip29WpJRhTk2+SwbvTv/HqksVLzEV0pp/5Ogs7Kjax+zjmXWT5s9DaSyy96zcZ9PNTtI04KMcRitkkuRS6lb2tPirSeekerPNf6tCnmFtic/e6L6mjq1J1ZudWTlJ9WZvJW8OCXzWW+uXdyw48NPpD69zzRhmShTju+kVzPRbWtW5limtusnyRvbOzp2sfUWZvnJ8zw8/N/8vdxY48c7aeTT9MVPFS4SlPpHojalW1FNyeEubfQ02oam5Zp2zaXJz6vyPJ5yresuSvVqGoxoZp0sSq/lE0NScpzcptyk922QbPTtNdVqpcJqHNR6s34xjvJjxxg0+xndS4pZjSXN9/I6CjThSgoU4qMV0RaMVGKjFJJckjy319C1jj2qr5R+pjdtccsrndLXt1TtafFPeT9mPVnO3NedxVc6jy+i6IitVnWqOdSWZMzWNnO6n7tNc5HSSY+a7Y4zCbqtlaTuqmI7QXtS7HR0KUKFJQpLEV+Yo0oUaahTWIox3l1C1pcU3mT9mPcxb2cc8rndQvLmFrScp7t+zHuzm7itOvVdSo8t/kTcV53FVzqPL7djLY2c7qphZVNe1I3Jr27Y4zCbqdPs5XVTfKpR9p/odHCEacFCCSitkkRSpwo04wpxSiuhgv7uNpTzzqP2Yk3uuOWVzuox6leq1hwxw6suS7eJz05OUnKTbbeW2TVqSqzlObzJvdnu0ux/aJekqr7JP8AuZr07STjm6y6RY8bVesvVXsJ9fE3b5ELCWEtjWavfeji6FF+u/aa6E91wu+TJ59XvvSSdCk/UXtNdX2NZCMpzUYJuT2SRU3+lWXoIelqr7WXJe6jXp3tnHiz6faRtaPDs5veTMlzUp0KMqlTkvzMspKEXKTxFbts5vUbt3VbbKpx9lfqXHKz04Y4fJfLy3Up3FaVSTy5dOx6dJsHXq8dWP2UP/p9ilpbzuayhDl1fZHT0KcaNOMKaxGJ0nNZ78tcsmM1iqjTa3e5bt6b2Xttf4Njql0raliOPSz9nw8TmZU3lvOW+51nNMo5cfDf9IpRlOcYQWZN4SOqsLaNrQVNYcnvJ92eLRbJ0o+nqxxOS9VPou5tJSUYuUmklu2zpP1jky3erDe3MbW3lN4cuUV3Zy85yqTc5vMpPLZ6NRu3dXHEs+jW0V4Eafau6uFH8C3k/AzfLrhj0m62Oh2n/wCiovCGf8m7yllt7FIRUYqMUlFLCSNXrV5wQ/Z6b9aXteC7D04+eTJ4NTu3dXDcX9nHaK/Urp1s7q5UPwLeT8DyxTk0kst7JHU6baq1t1F+295PxMSbrvnlMMdR6opRiklhJYSNTrl1hfs8Hu95/Q2F7cRtreVR8+UV3Zy05yqVJTm8yk8tlyv058WG72qacJTnGEFmTeEjqrKhG2t401zW7fdms0O1x/8A5E14Q+puW1FNt4S5kxn2cue71eXU7r9mtm0/tJbR+pzXienULl3VxKa9hbRXgX0q1/ablcSzThvLx8DF810wk48d1ttGtvQW/pJL7Spv5I91erGhRnUnyis+ZZGj1u69JUVCD9WG8vFkviOMl5MvLX1qkq1WVSb9aTyzbaFbZbuJrZbR/VmqtqMq9aFOHOT59jq6NONKnGnBYjFYRmR15sus6xkbSTbeEubOYvrj9puZT/Dyj5G01u59HRVGL9efPwRokZyThw8dlkSiCTnXoWRJVEmaLBEIlGRYEIkxYqUTkgkyr4Twk8KJB9n6x8i71GETjwALqJugAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARhdiQTS7qOFEcJYE6xe1V4SOFlwTpFnJWPD7AyAl42pyMYL4XYhxRnpWpyRUFuEjDM3GxqZSoABFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlEBASACAAAAAAEEkFUAAULlCyIiQAFAAAAAV6tPrcNT0b9mXLzNkaM21rV9NSTftLZnXjy+nh/6ePV7x4L2l6KrlezLdFbaq6VVSXLqvA2VxSVWk49eafianDTaezRnOdbuO3Dn8mPWt9FqSTTynujxajRzH0sea2ZGnVv3Un4x+h7mk00+TN/6jz+eLNoU8NNc0bu0remoqX4lszVXVF0arj+F7om0ruhWT/C9mcsb1uq9WeM5Mdxtrmiq9JxfPmn2ZpJRcJNSWGnho6CLyk08rmeDU7fK9NBbr2vqazm/LHDnrxTS7jD9DN7fh+hsjnItppp4a3RvLOuq9FP8a2kiY36a5cdeY1l/begrZivUluvDwMdtWlQqqcfiu6N3XpRr0XCXwfZmhqQlTqOE1iSM5TTpx5dpqujpzjUgpweYtZR5dRtvT0uOC+0j+aPHplz6Kfopv1JPZ9mbhczX+o52XDJzJutKuvSQ9FN+vHk31R5dUtfRy9NTXqP2l2Z4ac5QnGcXiS3TMeq7+M46iUVOLjJZT2aOfvrZ21Vrfge8WbqyuI3NFSW0ltJdi1zQjcUnCfwfZls2xjetaKzuJW1ZTjuuUl3R0dKpGrTjODzFrY5itTlSqOE1iSPXpl47epwTf2Unv4PuZldbN+Wz1G0VzTzH72PLx8DQNNNprDR1SeVlbo1uq2fGnWpL1l7SXXxFiY36V0i9xihVe34W/wDBuTkFsb7Sr70yVKq/tFyfvf7Mt2PNqtj6NutSXqP2kun+jWxk4SUotpp5TXQ6xpNNNZT2aNBqVk7efHBZpS/LwJVlbbTL5XUOGW1aK3XfxPbOEakHCaTi1hpnI0qkqVSM6bxKPJnS6feRuqfaovaiFabULOVrUysulL2X+hgoVp0KsalN4kjqatOFWm4VFmL5o5y/s52lTDy6b9mRmtSt/Y3cLunmO017Uexmr0oVqbhUjmLOUoVp0KqqU3iSOlsLyF3SzHaa9qPYK0V/ZztKm+XTfsyMNCrOhVjUpSxJHVVKcK0HTqRUovmjntQsJ2ksrMqTe0u3gyNRvtOvYXdPb1ai9qJ6qkI1IOE0pRezTONpVJ0qinTk4yXJo6TTNRjdxUZ4jWXNd/IzVavUtOnbNzp5lR79Y+Zr4ycZJxbTW6aOzwmnlZXY0mqaS4Zq2qbjzcOq8gr0aXqsauKVy0qnJS6S/wBm5TOGNvpmrSo4p3LcqfJS6xJWpWw1PSoXOalDEKvVdJHO1Kc6U3CpFxmuaZ2dOcakFODUovk0Yb2zpXcMVF6y9mS5oi6c5YX1Wzn6j4oPnB8mdNY3tG7hmm8SXOL5o5i+sa1nLE1xQfKa5Mw05ypzU6cnGS5NEqy6dvKKlFxkk0+aa5ml1DRudS083Tf6E6drMZ4p3eIy6T6Pz7G6TTSaeU+TMtTy4mcZQk4zi4yXNNcj1WN9WtJZpSzHrF8mdJeWVG7jipHE+klzRz17pta0zLHHS99fr2Ivp0FhqdC6xHPo6r/DJ8/Lue9HCI2ljq9a3xGr9rT8XuviRqVu73TaF1mTXBU9+PXz7mhvNNuLXLceOn78f17HR2d7Qu45ozTl1i9mj1GfTThz3Wep3FtiKlx0/dlv8jdXelW9xlxXoqj/ABRW3yNLd6Zc22Xw8cPehuT2N5Z6vb1sRqP0U+0uXzNnF5WU8o4M9Nre3Fq/sajS917r5GbGpXZ1KdOrDhqwjOPaSyay50OjPLoSdKXbmjBaa9B4VzTcX70N18jcW9zRuFmjUjPye/yMtOauNLuqGW6fHHvDf8uZ4+Wz2Z3Bir2tC4X21KMvFrf5kVx1Ocqcswk4vung2Fvq93R2c1UXaaz+ZsK+hUZb0akoPs90eCvo93S3jFVF3i/0I1GyttfpvavRlF94vJsKOp2lXHDWin2l6v8Ak4+dOpSlipCUH2ksAzYsd7CSksxaa7pl0zg6VSdN5hOUX3i8Hto6peU+VZyX8STM2K7FPozHO1oVPbo05ecUc9S16vH7ylTl5ZR66f8A5BTft0JrylkxWmwlpVlLnQS8m0UeiWj5OpHykUp63aS5upHzj9D0U9Vspcq8fimjNXy8z0Gj+GtUXmkyv/8Ab66XLXnD/ZsoXtrLlcUv70ZY3FF8q1N/1IzVlrUrQJdLhf2f7JWgT/8AYj/b/s3UasG9px+ZkUljOVgxY1Mq0i0CXW4X9n+zJHQe9y/7P9m49JBc5x+ZDr0lzqwX9SMVvtWvjoNL8Vab8kkZY6HarnKq/Nr6Hs/bLZLevR/vRSWpWcedeHwyzK7qkdIso/uuLzkzPTs7aHs0Ka8eFGCWq2y9l1J+UH+pilq8fwUJv+ZpfUzc8Z7rUwzvqNokksJJLsgaaeq12/Up04+bcvoeepe3U+ddxXaEUjnefCfbc/5+S/ToWzzVr+1o+3Xgn2Ty/wAjn5p1H9rOc/5pNkKnBcox+Ri/9OP1HSf8l+62dXXKK2oUp1H8keOtqt9V2pxjSXgt/wAzHCLk8Qi2+yR7KOmXVX93wLvPb/Zi/wDTlfUbn/Nhj7rU1IXFZ8Vao5P+KWQrXvL5I6WjokVh16rfhBY/M2NCyt6G9OlFPu938zPy8lXrxz/1ytto9Wvhwpz4felsjbWv/j9GGHXfE/djy+ZvClWrClHiqTjBd28Ge2X3U3+RS3tqNvHFGlGmvBczMaq51mlDKoRdR93sjVXN/cXGVOfDH3Y7Izcmpx2t7dajb2+U58c/djuae71WvWzGn9lD+Hn8zXnptbCvc4cIYj70tkZ3a7TDHHzXmby8vmei1sq9y/s4er7z2Ru7TSKNLEqv2s/Hl8jYYxhJJJDr+s5cv419npdGhiVT7Sp3fJfA2JhuLilbw4q01FdF1Zpb3V6lTMbdejj7z5v6DcjEmWdbW8vaNqvXlmfSK5mgvdQrXWU3wU/dX69zyttttttvqz02djWunmEcQ6zfIxu11mEx815Um2kt2zbWOkyklUusxj7i5vzNnZWFG1WYriqe++fwM9WXT5mOTL48e1SZXO6jFGMYR4YRUYrkl0MNzcU7eHFVljsurPJfanClmFDE59+i+ppKtSdWbnUk5SfVn50lvmvdhxb9vRe31S6eH6tPpFfqeaEZTkowTlJ8kjNaWtW5nimtlzk+SN/Z2dK1j6izN85NbmrZi65ZzCajy6fpipYqV0pT6R6I2hWUlFNyaSXVmm1DU3PNO2eI9Z9X5GPOVcJMuSvTqOoqhmnRxKr1fSJopylOTlNtyfNsg2mnaY54q3CxDmo9X5m/GLvJjxxg0+wlcyU55jSXXv5G/hCNOCjCKjFckiySSSSwl0R49QvoW0eGOJVXyXbzM77ONyvJVr27ha08veb9mPc52vWnXqOdR5k/yIq1J1ajnUblJ82z1afZTupZeY0lzl38EbkmLtjjMJuqWNnO6qbZVNe1I6KjShRpqFNJRRNKnClBQpxxFdEYL67ha08veb9mPczbbXHLK53UTfXcLWnl7zfsx7nOVqs61RzqPMmK9Wdao51HmTPRp1lK6nl5VJc338Ebk07Y4zCbqdNsZXU+KWVSjzffwOhjGMIqMElFbJIU4RpwUIRxFckjy6jextaeI4dWXsr9WZ3txyyvJVNTvlbQ4KbzVktv4fE55tttt5b6kznKpJym25N5bZsdKsPTNVay+yXJe9/o16dpJx4+WXSLHlXrLxhF/wCTcE/4NRq99wp0KL9b8cl08B7cPPJkwatfelk6NJ/Zp7v3n9DXU4SqTjCCzKTwkVW/LmdBpVl+zw9JUX2sv/ldi+ne2cePh6LC1ja0eFbze8n3Zkua8Lei6k+S5Lu+xeclCDnNpRSy2zm9Qu5XVbO6px9lEnlwwxud3WKvWnXqyqTe7/I9mk2f7RU9JUX2Uf8A6fY81lbSuqyhHZc5PsjpqNONGEacFiKWxa7cmfWajLzRpNauVLNvSeMe21/g9mp3itqXDB/az5eC7nPZbeXzYxtnpji45fNY40pymowi5SbwsHT2FtG1t1Bby5yfdmHR7P0cPT1F68vZT6I2U+FRcm8JLLZ2x5v/ANnPm83WLy3lzG1oSqS3fKK7s5ipOVSpKc3mUnlno1O4lc13Jfdx2iv1K6fau7rqK2gt5PwOu5l6XDD45uthodpmX7RUWy2hn/JvHtu+RjpxUIqMUlFLCSNdrV56On6Cm/XkvW8F2L6jjd8mTX6pd/tNx6r+yhtHx8THYWzuriMFtHnJ9keaKbaS3bOo0y1VrbpP7yW8n+hjW67Z2ceOo9UIqEVGKSilhI1et3fBD9ng/WlvLwXY993XjbUJVJdOS7s5arUlVqSnN5lJ5YyuvDlxYbu6mCc5KMVlt4SOosLdW1vGG3E95PuzWaFa5f7RNbLaGf8AJu843fIki8ue/wCY8+oXKtbaU/xvaK8TmW3Jtt5b3PTqd1+1XDcX9nHaP1Gm2zurlRfsR3kzGXmunHj0x3W20O29FSdaa9aotvBGxqzjSpynN4jFZZK2SS2wabXbrLVvB7LeeH8kPUcZLyZNfc1pXFedWXOT5dkYiESc69cmlkSiqLGKqyJRUlGaLEkAyJRYqSjNVJJBJhY+GApxMb+J9l+SPknx1cZXcph9hwsne/h0n3VsruOJEcLHD4jeX4aw/TiQ4vAcJPCh/R/COJkcTLcKHChrL9O2H4rxMcTLYXYnC7Drl+nfH8Uy+4y+5fAwOl/V7z8Y8vuMvuZAOl/T5J+MeX3GX3MgHT/1Pkn4x5fcZfcyYA6X9X5J+KZfcZfcvgjC7Dpf07z8Vy+44mWwuw4UOuX6dsfxXiY4mW4URwoayO2BxeA4vAcPiOEn9n8VPEhxIrwsYfYdsjrjftbK7kmPD7Ad79w+OfVZAY8k8TL8kT46uCnEyeLwNd4nTJYEcSJTRdys3GwABUAAAIaRIJray2eleFEcLLglwlamdjHgGQhpGLx/jU5P1QFnHsRwszcbG5nKgAGWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABKBCJIAAAAAAAGFQACqAAC4IRJAAAAABQzWlb0VVN+y9mYQJdeWcsZlNVvFutjwahRw/Sx/qL6fW4oejlzjy8j1ySlFprKex38Zx+dLeHNpoycZKUXhrkbm3qqtSUlz6rszUVqTpVHF8uj7oy2df0NXd+pLZ/U5Y3rdV7OXCcmPaNjdUVWpNfiW6NO002msNG9R4NRofvoLZ+0a5Mfty/5+TX81fTLjK9FJ7r2fobBpNNPdM56MnGScXhrkzd2ldV6Sl1WzXiTC78NcuGr2jV3lB0KuF7D3TItazoVVNcuTXdG3uaKr0nF8+j7M0kouE3GSw08NGcpqu3Hl3mq6GnJSipReU1lM8upW3pYekgvXit/FHl0254Jeim/VfJ9mbdcjX+o5auGTmkbnTbr00PRzf2keXijyalbejn6WC9ST3XZnjpzlTmpweJJ5Rz/zXfxyYullFTg4ySaezTNBeW8res4veL3izc2leNxSUls+q7MtdUI3FJwlz6PszVm3PDK43y0lncStqymt48pLujoqU41acZweYvdHM1acqVRwmsSR69Nu/QT4Jv7KX5PuZl07ZY78xstQtFc0+KP3sVt4+BoWmm01ujqU+q3RrtVs+NOtSXrL2l38RlEwy+qrpN7jFCq9vwt/4NscmbzS7300VSqv7Rcn73+yStWfbz6rZcDdakvUftJdDXwk4tSi2pJ5TR1Kw8prKezNFqVk7afHBZpS/LwJYuOTa6deq5hwzwqsea7+J7JxjUg4zScXs0zk6c5U5xnB4knlM6PT7uN1T7VF7Uf1I00+o2UrWeY5dJvZ9vBnnoVZ0akZ03iSOoqQjUhKE1mMlho56+s5WlXvTl7Mv0JWpW/sLyF3Sytpr2o9jPVpQrU3CosxfM5OhVnQqKpTeJI6WwvIXdPK2mvaj2IrSX9lO0qYfrU37Mv0MFCrOhUVSm8SR1dSnCrTcKiUovmjndQsZ2ssrMqTe0u3gyK3dhewu4e7UXtRPXKMakHGaUovZpnHU6kqU1OnJxkuTR0emahG6ShPEay5rv5EajW6lp0rZupSzKj+cfM8EZOMlKLaa3TR2OE001ldjSanpbgnVtlmPNw7eRGnp0zVI1UqVy1GpyUukv8AZt49jiDb6ZqsqTjTuG5U+Sl1RLFle7UtKjcZqUMQq9V0l/s56pCVObhUi4yWzTOzhOM4qUJKUXumupgvrKleQxUWJLlJc0RdOe0+/q2k/VfFT6wfJnS2d5Su6fFSl6y5xfNHL3lnVs54qL1XykuTMVKrOlNTpScZLk0RZdO1nGNSDjNKUXzTNHf6O45qWmXH3Oq8jPp2sQqtU7nEKnJS6P6G3RG/biWmm01hroe6w1GtabRfHT9x/p2N7fafRu1mS4anSa/Xuc9eWNa0l9pHMOk1yYPTp7G+o3cfs5Yn1g+Z6zhYycZJxbTXJo3NhrU4YhdJzj765/7M2NSvffaPSr5nQxSqdl7LNFdWla1litBpdJc0/idZb16deHHRmpx8DJKMZwcZxUovmmspmWnEwk4yUotprqjcWWtVaWI3C9LHvykvqei90SnPMrWXBL3Xy/0aW4tq1tLhrU3Hx6P4kI661vKF0vsaib6xezXwPScJFuLTi2muTRtLPWbijhVcVYeOz+ZLGpW8utOt7nLnDhn70dmai50WvTy6DVWPbkza2mp21xhKfBJ/hnse4y04mcJ05uNSMoy7NYZMJOLTi2muTR2lWlTrQ4asIzj2aya640OhPLoTlSfZ7olVrrXWLqjhSkqke09/zNrb65QntWhKm+/NGouNJu6OWoekj3hv+XM8bTi2pJprmmZqx21C5o11mjVhPwT3+RnRwUW08p4Z7aGpXdDHBWk12l63+TNjTsJRUliSTT6NZPNV0yzq86MYvvHb/BqaOvzWPTUYy8YvB76Ot2lT23Om/wCKP0M1WOroFJ/dVpx/mWTy1NCuI70505/HDN7RuqFbHo61OTfRS3+R6o06kuUZfIzbJ7am76chPTLyHOhJ/wAuH/gwTo1af3lOcf5otHdxt6j5pLzZljaS6zS8jleXCfbpMMr9PnyZKPoL0+hP7yEZ+cUVekWD52tP4LH+DlefF0nFk4NMvGLfJN/A7paPYdLeK8mw9ItG/Ykv6mcsv+j8jrjwz7rio0aj/A/jsZo203zcV8Tr1o1r/wD1P7iVolr3q/3L6HG8+d9Os4+Oe3KRtO8/yM0LaC55fxOoWjWvep/cXjpFouk35yOOWfJft1k459OZjSgvwr4mSKSWySOnjpdmv3WfOT+plhYWseVCHxWTjZlfddJyYz1HLEwpzm/UhKXksnXQoUYezSpx8opGUz1Lzf8AjlKdhdVPZoT/AKlj/J6aejXMvacIeby/yOiBesZvLWnp6JH97Wk/5Vg9dLS7Sn+7433k8npq16VL7ypCPnLB5Kuq2kOU3N/woupE7Z5PbThCCxCMYrslgsaSrrj5UaPxk/0PFW1O6q/vHBdobE7QnHlXS1KtOlHNScYLxeDwV9Yt6e1PiqPwWEc7KTlLMm5Pux5E7Ok4p9tjX1e4qbU+GkvDdmvqTnUlxTk5S7t5PVQ066rezTcY957Gyt9FprevUc32jsiatXtji0UYuTUYptvkkbC20m4q4dRKlH+Ln8jf0belQWKVOMPJbmU1MWLy36eG10y3oYbj6SfeX0PceW6vre3yqk1xe7Hdmpu9Zq1MqhFU493uy7kZmOWbd3FxSt48VaaivHmzTXmsylmNtHhXvS5/I1M5yqScpycpPq3ktRo1K8+GlCUpeBjLK11x45PNVqTnUk5VJOUn1bL29vVuJ8NKDk/yRt7TRksSupZ/gjy+LNtTpwpQUacVGK6JEmP6ZcknprLLSKdPErhqpL3V7K+ptEklhLCXYipUhSg5VJKMV1Zpr3WM5harH8bX+EXxHLWWbZ3d3StIcVWWH0iubOdvdRq3LaXqU30XXzPLVnKc3KcnKT5tsyWtrVuZYpx26yfJHh5s++X/APh+lwcM48d32wLd4Rs7LS5VMTuMxj0j1f0NhZ2FK2w8cdT3n08j2nnuX41ny/WLHThGnBRhFRiuiKXNxTt6fFVljsurPJfalCjmFHE6nfojR1qs603OpJyk+4mO/aYcdy816b2+qXTw/Vp9Ir9TywjKclGCbk+SRmtLWrczxTWy5yfJG/s7Olax9RZm+cnzZq2Y+HXLOYTUebT9NjRxUr4lU6LpE2ZWUlGLlJpJc2zS6hqTqZp27ahycur8jHnKuEmXJXo1HUlSTp0GnU6y6R/2aSUnKTlJtt82ypttO03ixUuViPNQfXzOk1i7yY8cYNP0+Vw1UqZjS/ORvoQjCKjBJRXJIukksJbHg1G/jbJxhiVV9Oi8zF3a423kq99ewtYe9UfsxOdrVZ1qjnUeZMic5VJuc5OUnzbPZp1jK5lxTzGkub7+CNyTGO2OM45uq6fZSup5eY0lzffwR0NOEacIwhFRiuSJpwjTgowSUVskjzX95C1h0lUfsxM7245ZXO6ib+8ha0+9R+zH9Tm6tSVWo51HmT5smtVnWqOdRtyfU9WnWMrmfFPKpLm+/gjcmnbHGcc3U6ZYu5nx1NqK/wDrwOhilGKSWEuSREIxhBRisRSwkjx6lfK1hwww6rWy7eJne3DK3kqmq33oI+ipP7V837qNA93l8yZyc5OUm3JvLbNnpNh6RqtWXqL2U+v+jc8O8k48WTSLHhxXrLf8EX08Tbg0+r33OhRfhOS/wT24eeTJh1a+9PL0VJ/ZRe795ngo05VakYQWZPZFUm2klls6HS7JW0OOazVkt/Bdi+ne2cePhnsbaNrRUI7ye8pd2XuriFtRdSfTku7LznGnCU5tKMd2zm766ldVuJ7QW0UT244Y3O7rFXqzr1ZVKjzJ/ke7SLP9oqekqL7KL+bPLY2srquoLaK3lLsjpqUI0qcYQWIpYSFdeTPrNRlRpdZvOJu3pvZe2+77Hr1S8VtS4IP7WfLwXc55vO75kkZ4cP8A6q9OEqk4xgsybwkdLZWkLagoLHE95SXVnk0ez9FD09RevJeqn0RspSUYuUniKWW2O1l8Jy5dv5ea9rq0oSqSw3yiu7OXqTlUqSnN5lJ5bPdqF07qs3+7W0UY7Kyd1XUY7RW8n4Hacu/9GPF0m3r0Oz4pftFReqvYXd9ze8ikIKnBQilGKWEjW61eeip+gpv15r1n2R38SPNd8mTward/tNfEH9lDZePiYbK3ldV4047LnJ9kedJtpLds6bTLT9lt/W+8lvJ/oYk3XbOzjx1HrpwjThGMFiMVhI1+s3fo6XoIP15e14I9l1Xjb0ZVJ8lyXdnL1asq1WVSo8yk8suVcuLHtd1CTbSS3e2DqNNtla26i/blvJ+JrNEtOOfp5r1YvEfF9zeGZF5s/wD5jDe3CtqEqj58oruzl5Sc5ylJ5k3ls9eq3f7TcYi/s4bR8fE8Zi+XXiw6xKLFCyMOqSyKkpmdCyLIqSZosiSqLGKJCIRJBYEIsY0r4ZgAH2d8hAAAAAAAAAAAAGQAGV3Iyu5NxdVIIyu4yu43DVSCMruMruNw1UgjK7jK7jcNVIGV3A2aoACoAAAAAAAAAABhEcKJBNRe1ivCOFlgTpGu9UwyGZAZ+OLOSsZOWXwuxHCidLPS98b7RxE8SI4exHCxvKLrCrJokxgfJ+p8f4yApxMni7mpnGbhVgQmmSal2zZoABUCHFEglkqy2elXHsVawZAZvHG5yX7YwXaTIcexi4WNzklVAxjmDDYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEogICQAQAAAAAEAlkFUAAULlCyIJAAAAAAAFTTm4TUovdG4pVFVpqUeT/I0x6LKt6KpwyfqS/Jm8MtXTz/8ARx95ue49t3R9LT29uO6+hqzdmvvqPDL0kVs+fma5Mfty/wCbl1/FZ9Pr8UfRyfrLl5HswpJxksp80aOEnCSlF4a5G4t6qrU1Jc+q7MYZbmjm4+t7Rq7qg6FVx/C90/AWtd0Kql+F7SRtbmiq9Jx5S5p+JpZRcZOMlhroc8p1rvx5zkx1XQxkpRTi8p8mePUbfjj6SC9aPPxRg0254X6Kb9V+z4M2hv8A1HKy8eTnTc6dc+lhwTfrx/NHj1C29FL0kF6kufgzy05ypzUoPDXI5/5r0WTkx3HRTipwcZLMWsNGiu6Ereq4veL3i+6Nza1416SlHn1XZi5oRr0nCXPo+zNZTccsMul1WmtLiVvVUlvHk13Rv6c41IRnB5i1k5yrTlSqOE1iSPVp136CfBN/Zy/J9zGN14ds8e3mNhf2quIcUfvIrbx8DSYw8PZrmdNzNfqdnxp1qS9Ze0l18S5T7Tjz14qul3mMUKr2/C3/AINucojdaZe+lSpVX9ouTfUkv01nj9xg1Sy4G61Jeo/aS6GvhJxknF4a3TOo2aw1lM0epWTt5ekpr7J//JLGscvps9OvFcw4ZbVVzXfxPbKMakHGaTi1hpnKU5yhNTg2pLdNHQ6ddxuYb7VF7S/USlmmq1CzlazzHLpN7Pt4Hmo1J0akZ03iSOpqQjUg4TSlF80znr+zlaz2y6T9mX6MzY3jdt3Y3cLqnlbTXtRPRVpwrU3CpHMX0OVo1Z0ainTeJI6Kxu4XUMraa9qIVpr+znaz96m+UvqYKFWdGpGdN8MkdTOEasHCpFSi+aOf1Cxlaz4lmVJ8n28GZalbzT72F1DpGoucf1R6pwjODjNJxezTOQpzlTmpQbjJbpo6LTdQjdRUJ4jWXT3vIK1mpafK2zUpZlR/OJ4ItxacW01yaOwaTTTWUaXUtLcM1bZZjzcO3kSxXp0zVFU4aVw0qnJS6SNucSnubfTdUdLFK5bdPkpdURqV7NR0uNfNS3xGrza6S/2aCcJU5uE04yXNM7GEoyipRacXumup576ypXkPXXDNcprmZVobC/q2kvVfFT6wf6HS2d3SuqfHSl5xfNHLXlpVtZ8NWOz5SXJmOjVqUKinSk4yXVBZXZVIRqQcJxUovmmaLUNJlSzO1TnDm49V9T2afq1OviFbFOr36SNojLTimbDT9Uq2uIS+0pe63uvI3F/plK6zKP2dX3l18znbu0rWs+GtBpdJLkwvp1tnd0bqHFRnnuuqM7SlFxkk0+aaOIpVJ0pqdOTjJdUze2GtJ4hdrD99L/KM6alZL7RYzzO0fDL3HyfkaOtSqUJuFWDhLszs6c41IqUJKUXyaK16FK4hwVoKcfHoRdOQoVqlCfHRm4S7o3ljrkZYjdx4X78eXxRgvdFnHMrV8cfdk9zUyhKnJxnFxkuaawQm47elUhVgp05KUX1TyWnCNSLjOKlF801lHFW9xVt58VGbg/Dqbqy1xSxG6hh+9D6GW5We60SlUy7eTpy7PdGnurG4tW/S03w+8t0ddbP9ogp0PXj3R6VaVZc0kvFmLnjPddJx5X1HAHrtb+4tsKnUbj7st0dVcf8AjtvcZbapT701+hra/wD4zVo5dOfpo/w7P5HO8+H66Y8Gd+kWuuwe1xTcX70d0ba2uqNws0akZ+Ce/wAjnZWcKUuGdKUZLmpZL04xg04RUWuTWxyv/Rj9R2x/5cvuuojGUvZi35Imdj+0RxVoRkv4kjUW2rXdHH2npI9p7/nzNpba9TltXpSi+8XlHLL/AKL9R0n/AC69156v/jNKpvCTpPweUeSp/wCL14exWhUXbHCzpKF9bV/u60Mvo3hnqRzvPnftucOE+nEVNIqUPvaNXHd8vmisaFKPKEfjud2jHVtqNb72lCT7uO5yueV911xmM+nGRSXJJeR6KVxWpfd1akfKTR0NTR7SfKMofyy+p5p6DHf0ddrwlE512mUeGlq15D97xL+JJnqhrtwl61OnLyTRjnodzHeMqcvi0zDLTLyC3ot+TTMVf5rZQ19fjt38JGeGuW79qnVXkk/1NDK1uIe1QqLzgzHwuPtJrzRmr1xrqI6zaPm5rziZY6tZvnWx/S/ocnEsjNq/HHWrU7P/AL4/J/QutTs/++PyZyBbJi1fjjrv+Us/+5fJj/lbNL77P9L+hyaLozbVnHHUPWLRcpTflEq9bt17MKr+CX6nNplkm3smzFyrXxYt89cj+Gg35yx+hinrdZ+xSpx88s1tO3rT9mjUflFmeGnXc+VGS89v8md1euEXnqt3LlUUf5Yo89S5r1PbrVJLtxHsho1zL2vRx85fQ9FPQ/8Asr/CMSap2wjTA6Ono9rH2lOfnL6HqpWlvS+7owT743L1S8s+nLUretV+7pTku6Wx7aOj3M/vOCmvF5f5HRgvVi8t+mqo6LRjvVnOo+3JGwo21GgvsqcYvulv8yta6oUfvasIvtnf5Hgr61SjlUqcpvu9kXxE/rJtjHVrU6Mc1ZxgvFnO19VuauVGSprtFfqeKcpTk5Tk5SfVvJOzU4r9t9cazRhlUIuo+72Rq7nUbmvlOfBH3YbHkjGUniKbfZI99tpNzVw5pUo/xc/kZ3a31xxa8z29rWuXilTbXfkvmb620q3o4c06su8uXyPfFJJJLC7IsxZvL+NRa6LCOJXMuN+7HZG0p04UoqNOKjFdEiatSFKLlUmox7tmqu9ZhFuNvHjfvS2RbqMf1m2s5RhFynJRiubbNVeaxTgnG2jxy958v9mnuLmrcSzWm5dl0XwMUYuUlGKcpPkkjFy/HXHik9slxcVbifFWm5Pp2RSnCVSXDCLlLskbOz0epPErh8EfdXN/Q2sKFKhFQowUV1fVnHmy6Y7dMMpvUauz0pLErl5fuJ/5ZtYRjCKjFJRXJISaim20kubZq7zVYxzC2XFL3nyPzvOT0f1yVsLivToQ4qskl0XVmkvdSqV8xp5hT/N+Z46tSdWbnUk5SfVl7e3q3E+GlHPd9EbmMnt2x45j5rCbKx0yVTE6+YQ5qPV/Q2Flp9O3xKXr1O75LyPY+ZLl+M5cv1irThGnBQpxUYrkkUuLinb0+KrLHZLmzyX2pQoZhSxOp+SNJWqzrVHOpJykxMd+2cOO5eaz3t9UupYfq01yiv1PNCEqk1GEXKT5JGa0talzPFNbLnJ8kb+ztKdrDEN5PnJ82atmPh1yzmE1Hn0/TY0MVK2JVOi6RNiROUYRcpNKKW7ZpNQ1J1M07dtQ6y6sx5ycJMuSvRqOpKnmnbvM+Tl0RpJNttttt82wjb6dpmcVbleUH+p08Yx3/njjBpunuvipWTVLousv9G8jFRioxSSWySJPBqGoRt04UsSq/lExu5VxtvJV9Qvo2seFYlVfJdvFnPVKkqs3Oo3KT5sTlKcnKbbk922e3TrCVw1OpmNJf/RuSYu2OM45uo06xlcy4p5jSXN9/BHQQhGEFGCSitkkIRjCKjFcMVySPJqN7G1hwx9aq+S7eLM27ccsrnfBqN7G1hiOJVWtl28Wc7OcpzcptuT5tk1JyqTc5tuT5tnu0ywdw/SVU1RX/wBf6Nzw7TGcc3U6XYOu1VqrFJcl73+jfLCSS2SCSSSSSSWyPBqd8rePBTadZ/8AyZ3uuFt5Kpqt/wChTo0X9o+bX4f9mhJbbbbeW98m10mw4sV6y25xi+vib9O+px4sukWPo0q9Zeu/ZT6eJtc4W/IGm1e+4s0KL2/HJdfAntw88mTBql7+0T9HTf2Uf/pnkoU51qkadNZkzHFOUkorLeyR0emWStafFLerLm+3gX6d7Zx4+Gezto21BQju/wAT7sm7uI21F1J8+i7svUqRpU5TqPEUstnNX11K6rcT2itox7Ijjhjc7uqVqs61SVSo8yZ7tIsvTz9LUX2cXsu7PLYWsrqtwraK3k+yOnpwjThGEFiMVhIV15c+s6xdGl1i8436Ck/VXttdX2PXqt5+z0+Cm/tZL5Luc/nckjPFh/8AVXpxlUmoQWZN4SOmsraNrQUFhy5yfdnj0iz9FD01RevJbJ9EbKUlGLlJpRW7bM1OXPtdRivLiNtQc5Yb5RXdnK13OdSVSTy5PLZ7L+6d1Wb39HHaKFhbSuq6j+BbyfgaxzuLpjxzHHdZ9Ds+KSuKi9Vewu77m8EacYwUYLCWySNZrV56Kn6Cm8VJLd9kerDPGzw8eUueTwatd/tNbhg/socvF9zz2dvK5rxpx82+yMEU28I6XS7T9loesvtJ7y8PATzXXKzjx1HspQjTpxhBYjFYR4NZu/RUfQwf2k1v4I9lxWjb0ZVJ8kuXfwOXr1ZVqsqk3mUmXK/TlxYdruqEoglHGvUklEAirghEmaLIlFUWM2CyJRUsZokkgGRKLFSTNivh2URxIrwsnhPsPbL8fJeuP6niRHF4DhJ4UP6P4RxMjiZbC7DCHXL9O2P4rl9xl9y+AOl/TvPxj3Jw+xcD4/8A0+RTDGH2LgfHD5KpwscLLgvxw+SqcLHCy4Hxw+SqcLHCy4Hxw+SqcLGH2Lgnxw+SqYfYjDMgHxw+SsYMgHxr8n/jHknL7l8EYQ6X9O8/FeJjiZbhQ4UTrkdsPxHEOIcPiOFj+4fxU8SGV3K8LGH2HbKe4dMb6q4MYy+5fkPjZAU4mTxF7xn46sCvEieJGu0qdbEgArIAABGESCa2stivD2I4WXBm4StTOxjBkIaRn4/xqck+1VJkqQ4ezIaaG8ousMl00+oMZOWWcn6l4/xcFVIlNM1MpWLjYkAGmQhpEglm1ls9K8L6FeRkBi8c+m5yX7YwXcUVaaMXGx0mcqAAZaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASCESQAAAAAAgkBUAAqgAAuCESQCESAAACgAA2VjX44cEn60fzR6ZRUotSWU9maWE3CalF4aNxRqKrTUo/Fdjthluar8/n4+l7T01lxSdGo4vl0fcta13RqZ/C+aNhcUVXpcP4lvFmpknFtNYa2ZzynW+Hp485y46rfQaaWHlPkeTUbfjj6WC9Zc13Rh0+4w/RTfP2X+hs0b8ZRw88WTnjcWFz6aHDJ/aR5+K7niv7b0U+OC9SX5M89Kcqc1ODxJHObxr1WTkx8N/KMZxcZLMXszS3VB29Vxe66PujbW9aNempx+K7Mm4oxuKTi+fR9mbym3HjyuF1WotLiVvVUlvF7NdzfQmpwUovMWso52pCVObhNYaPVp916GfBN/Zv8mc8brxXbkw7Tce+/tVcU+KK+0jy8fA0rTTw1hnSp/I1+p2nEnWpL1l7SXXxLlj9xOPP6qumXmMUar2/C3/g2q5nLm40289KlSqP7Rcn3JjfprPD7jDqdnwN1qS9R+0l08TXxbi04vDW6Z0+zWHyNLqNn6CXHTX2Tf9pMp9tYZb8VsdOvFcQ4Z7VUt/HxPY4xnBxmk4vmmctCcoTUoNqS3TRv7C7jcw32qLmv1EpljrzGsv7OVtPijl0nyfbwPNSqSpVFOm8SXU6ecI1IOM0nFrdGhv7OVtPKy6T5Pt4MzY3jlturG7hdU8raa9qJnqQjUg4TipRfNM5ajVnRqKdN4kjorG7hdU8raa9qINaae/spWs8rMqT5S7eDPPRqzpVFOm8SR1E4RqQcJpSi+aZoNQspWsuKOZUnyfbwZK3K3Nhewuoe7UXOP0PXOMakHGaUovZpnIwnKnNTg3GS3TR0Om6hG5ioTxGsunfyIumu1HT5W7dSlmVL84nhi3FpxbTXJo67CeU1lM02o6Y4Zq2yzHm4dvIlWV6NN1NVEqVw0qnJS6S/2bVHGm107U3TxTuG3DkpdV5kaevUdMjWzUoJRqdV0l/s0c4yhNxmnGS2aZ10ZKUVKLTT5NHmvLKndx9b1Z9JpbkWNJYX9S0kkvWpt7xf6HSWlzSuafHSlldV1Ry11a1bWfDVjt0kuTKUK1ShUU6UnGSI07CrThVg4VYqUXzTNDqGlTo5qUM1KfNrrH6mx07UoXWKc1wVu3R+RtY0Kr5U5fFYM2ye2pjcvUcKbTT9VqW+IVs1Kf5o3V9/4+7nM6ajRq+ez88Gjr6VWt58Fx6j6YWU/IxeXCfbrODkvqOjtrilcU+OjNSX5oyVKcKsHCpFSi+aaOctaP7PUU6dSakuz5nR6df2tTELmChP3m/Vf0OV58Y7Y/8ALn9tLfaK1mdo8r3Hz+DNT6KopOLpzUlzWOR9LhGEcOMYpPqkY7uzoXccVYb9JLZo53/p/I6T/k/a4Oynd20s0cpdYvk/gdHYXca+I15Rozfd5T+JhvdIr2+ZUvtafdc18DXmLz5X07Y/8uEddCyjs3UbXghX0q0uI4r0+Ps28NfFHOWeoXFq8U5Zh7kt0b6y1ihXxGo/RT/i5P4nK8md+3ScGE+mvuv/AB1U8ytVGa92XM1k6cqMnCcHCS6NYO3W6TXIpXoUq8eGtCM14rkcrlb7dMdY+o42lUnSmpU5SjJdU8G2tNdqwxG4iqi7rZmW60JPMrWpj+Gf1NTc2le2f21KUfHp8zLr4rqrXUba5woVEpe7LZnt5o4I9trqNzb4UKrcfdluiWJ1ddVpU60OGrCM12ksmtuNEt6mXSlKk/mjDa69B7XFNxfeO6NpQu6Fx9zVjJ9s4fyM08xz9fRrqllwUaq/he/yPDOE6csVIyhLtJYO3REoRqLhnGMo9mskambiUeihdV6P3VWcV2T2+R0VbSLSryg6b7wePyPDW0GXOjWT8JrH5ma12lYqOt3UNpqFReKw/wAj20depP72lOP8rz9DVVdKu6f7pyXeLyeaVOdN4qQlF9pLBmrqV1dLVbOf71Rf8SaPbSrUqv3dSE/5ZJnDpkmTo7slHE07mvD2K1SK8JM9NPVLyHKs2vFJkp0rr0PBnMU9bu48/Ry84meGvVfxUYPybRmnSt+6NOXtU4Pziirtbd86FJ/0I08de963+U/9GWOu03zoTXlIzV65Np+yW3/r0f7EFY2r/wDz0v7TXLXaPWlU/IutcoY+7q58l9TN0usmyVnbf+vR/sRZWtuuVCkv6Eaxa7R6Uqn5D/nqfSjP4szdL1ybeNGlHlTgvKKMsUktlg0X/Or8Nu/jP/RV67U/DRgvNtmLYvTKuhRZHMy1q5fJU4+S/wBmOWqXc/3uPKKRi5RqcWTqik6kIL15xj5vByc7qvU9utUa8ZMxc3uTss4f2uoqajaU+daLf8O55aut0V93TnLz2NCTGEpvEIuT8FknatzixntsqutXEtqcYQ/Nnjq3lxW+8rTa7ZwvkZKWm3dTlRcV3lseyjok3vWqxj4RWSeabwxagQjKcuGEXJ9ksnSUdJtaeOKMqj/iZ7adOFOOKcIwXZLBeqXln05yhpV1VxmKprvN/obGhotGG9acqj7LZG1MVa4o0FmrUjHwb3L1kc7yZUo0KVGOKVOMF4IympuNapRyqEHN93sjWXGo3NfKc3GPaOw7QnHlfbobm9t7f7yolL3VuzU3OtTllW8FBe9LdmpMlC3q15YpU5S8enzJcq6zjxntFarUrS4qs5SfiykYSnJRhFyk+iWTc2ui8pXM/wCmH1NrQt6VCOKUIxXhzJ1peSTxGktdHqVMSuH6OPZbs3Fta0baOKUEn1fV/Ezngu9UoUMqL9JPtHl8xqRzuWWfh728LJqbvU6VFtQfpJ+HL5msvdQr3KcZS4YP8Mdl/s8R4v8AovfLX493/Pwax7ZM91d1bmX2kvV6RXJGBRcpJRTbfJI91pptatiU16OHd838Dc2tpSto4px9brJ7tnnuUnp6MuTHHxGss9KlLErl8K9xczcU6cKcFGnFRiuiLN4W5rbzVIUsxoYnPv0X1M+cnHeXJXurVqdGHHVkor/JpL7UqlbMKOYU+/VnjrVqlafHVk5P/AoUKlefDSi5Pr4GpjJ7dseOY+axmxsdMnVxOvmEO3VnustOp2+JVMTqd+i8j3C5/jOfL9YlOnCnBRpxUYrojHc3FO2p8VWWOy6s8t9qMLfMKeJ1fyXmaOtVnWqOdSTlJmZjv2zhx3LzWe9val1LD9WmuUV+p5qcJVJqME5SfJIzWlrUup4prZc5PkjoLO0p2sMQWZPnJ82btmPiOuWcwmo8+n6dGhipVxKr07RNiVnKMIOU2kkt2zRahqTrZp0G40+r6yMzdrjJlyV6NS1JRzSt3mXJzXTyNK3ltt5Yxl4RuNO03haq3K35qD/U34xd/wCeOMOm6c6rVWusU+aj73+jeJJJJLCXJA12pagqCdOi06vV9I/7MbuThbeSsmo38baPDDEqr5Lt4s5+c5Tm5Tbcnu2yJScpNybbfNs2Gm6e67VSsmqXRe9/o6SdXaScc8q6bYO5lx1E1SX/ANHQRioRUYpJJYSQilFJRSSWySPFqV8raPBDes+S7eLMb3XG28lNSvlax4IYdV8l28TnpylOTlJtyby2xOUpycptuT3bfU2GmWDrtVayxSXJe9/o3rTtJOObTpdh6ZqrWX2a5L3v9G9wEkkksJdka7VL9UE6VF/avm/dJvbhbeTJj1a+9GnRov137TXTw8zSEtttt8zb6TYezXrLxhF/5NO/jjxZtKsPRRVasvtHyXu/7Nm2kst4S5thGj1a+9JJ0KL9Re0118Ce3CS8mTFqd67mpwU39lF7ePieWhSnXqxp01mTMcIuclGKbk3hJHSabaK1pb4dSXtP9C3w75ZTjmozWlvC2oqEPNvuxeXMbWg5y3lyiu7L1akKNOU6jxGJzV5cyuq7nLZfhj2RNbccMLnd1SrUlWqSnUeZSe7NhpFl6afpqi+zi9k+rPLYWsrqtjlBbyZ00IxpxjGCxFLCSFdeXPrOsWNLq95xv0FJ+qvafd9j1are/s9P0dN/ayX9qNAZ0zxYf/VXpwlUqRhBZlJ4SOnsbaNrQUFhy5yfdnk0iz9DD01RfaSWy7I2MpKEHKTSit22Spy59rqMd5cRtqDqSxn8K7s5itJ1pynUeZSecnov7p3VZv8AAtooiwtpXVdQW0VvJ9kJ4dcMJhjuvRo1k3P9oqL1Y+x4vubstGEYQUYpKKWEjWa1dehp+hpv15rdroj0cfLL4rx543PLw1+rXn7RW4IP7KHLxfc8KKko09GM1NRYAEqpRJCJMKlFihZEElkVLIyLIlFSTNFkSQSYokEEkHw8AH2R8iAAAAAADKIyibi6qQRxIcSHaL1v4kEcS8SOLwJ2h0qwK8Q4vAd4dMlgV4vAcXgO8XpksCvF4Di8B3idMlgV4hxIdodKsCvEieJDtDrfxII4kMruXcTVSBldwVAAAAAAAAAjC7Egml3pHCiOHxLAnWL3qnCyMPsZAZ+ONTkrGTll3uRwonSz0vyS+1eJk8Q4SOFjeUXWFWyn1JMYyJyfqfH+MgKKTJ4l1NzOVm4WLAZXcGmAAAGkVcexYEuMqzKz0o4sgyBoxeP8dJyfqibRKl3Dj2I4WZ/rFf5yWTTJMZKbNTk/UvH+Lgqpdy2cm5ZfTnZZ7AAVENJkOPYsDNxlamVjHyBkKuPY53C/TpOSfaoDWOYMWadN7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJIJQAAEAAAAABAJZBVAAFTksULIiJAAVCJAAAAKGa0r+hqb+w+ZhAl15ZyxmU1W8i+q5Hl1C34l6WC3XtfUxWFflSn/S/wBDYx3R38Zx4J24c9NEbewuPSw4ZP14/meK9t/RT4oL1H+R56c5U5qcHho4y3GvZlJy47je1IKcHGSzFmluaMqFVxfLo+5uLetGtTUo/FdmRc0VXpOL2fNPszplO0cOPO8d1Wqta7oVOJbxezXc3dOanFSi8xfJnP1ISpzcZLEkeqwufQz4Zv7N/kznjlrxXfkw7TtHvvrVV4cUfvI8vHwNM1htNYaOjTysng1G14k6tNet+Jd/EuWP2zxZ68VXTbvGKNR7fhb/AMG0OYNxp156RKlUfrrk31Jjfprkw+4w6lacDdWkvVftJdPE16bTTTw1umdK1lYfI0+oWnoZcdNfZv8AImWP3GuPPfithp92q8eCe1VfmeySUouMkmns0zl4SlCSlFtSXJm+sLuNzDDwqi5rv4iXZljrzGtv7N28+KOXSfJ9vA81KpKlNTg8SXU6WUY1IOM0nF7NM0V/aStp5jl0nyfbwZmzTeOW/Fbmxu43NPtNc4nonCNSDjNKUXzTOXpVJUqinTeJI6Cxu4XUO1Re1EspZry1N/ZytZ5WXSfJ9vBnmpVJ0qinTbUl1OnnGM4OM0nF80zR31jOhLignKk+vbwZmzTeN34bbT72N1HDxGqucf1R65xU4uMknF7NM5alCtGalCMoyT2fI6TSqkrtejqOEKy6N+15GLnjPdbnFnfUajUdPdDNSlmVL84mvTcWnFtNcmjvY6dnadRY6pI1Opf+Pwpp1bbilH8UO3kc7zYO+P8Az8l9x5tN1NVEqVw8T5KXR/7Nqc9GhTXKC+Ju9J1NUeGlcJej5KeN15mL/wBE+o6T/kt915r/AEiVzmpbU2qnVJbSNNK0rRm4zpuMls09sH0WElKKcWmnumjy6hp9K8hl+rVXKa/U5X/ov1HbH/kx+65LTqle1lhyi6T5x+h1NnQoXNPjp1nJdUlhrzOeu7Wra1XCtHHZ9H5EW1epbVFUoycZf5MXmzv264/8/HPp1U9OtqtNwq0+OL6SZotQ0T9lzOjBVKXllxNxpup0rpKE8Qre70fkbFHK55fddsePGeo4hbLbY2+navOilTuM1KfJS6r6ns1DSKdfNS3xTqdukvoaCtSqUajhVg4yXRmfbpHZ0KtOtTU6U1KL6omtRp3FNwrQUo+Jx1rc1bWpx0ZOL6rozotP1alcYjVxTq9nyfkzNix4L/R6lHM7bNSHu/iX1NVyeHzO3R5L3TqF2m5Lgqe/H9e5NtbaCy1GvaYUZcVP3Jcvh2OhsdSoXeEnwVPcl+nc5290+vaNuUeKn78eX+jyLZkqu8PHeadb3WXKPBU9+Oz+Pc0djq9e3xGr9rT7N7r4m+s76hdr7Kfre7LZkGhvdKuLbMor0tP3o8/ijwHco8d3ptvc5cocM3+KOzIu3O2l/cWuPRVHw+7LdG7tNbo1MRuIulLvzRrLrR7ijl0l6aH8PP5Gvw02pJproyWba9u5pVI1IqVOSlF9U8l5JNNSSafRnD0K9WhLio1JQfg+Zt7XXqkcK5pqa96Oz+Riw02NzpFrWy4xdKfeHL5GruNEuaWXScasfDZ/I3drqFtc4VOqlL3ZbM9SIu7HE1Kc6UuGpCUJdpLBC7nbzpwqR4akIzj2kso19fRbWpn0fFSl/C8r5MlamTS2+pXdDaNWTj2lujZUNeeyr0fjB/ozzV9DuIb0pQqL5M8Fa3rUPvaU4eLWxlfFdVQ1W0q/veB9prB7ozjOPFCSlHunk4NGSnUnTeYTlGXdPBLF6u56k4UliSyjkqWq3lPlVcl2ksntpa9VX3tGEv5W19TKda3NSxtant0IfBY/weepotpJ5ipw/ll9TFS1y2l7cKkH5ZR7Kep2c/Zrx+OV/kyvmPDLQU96dw14Sjkwz0K4Xs1KT+LRvadelUfqVIS8pJmYi9rHLvSLyPKmpeUkUlp13HnQn8Nzqyye5mxr5K492lzHnb1V/QyHRqrnSn/azswY0s5HG+jn7kvkSoS91/I7NEozcV+RxihP3JfIyKjVfKnN/wBLOwRdMzcV+X/xyMLW4lyoVf7GZo2F1LlQn8Vg6okzcV+WubjpV5LnTS85IzU9FuH7U6cfi2dAiTHWF5cmnp6H79f4KP8As9NPRrWPtOpPzeP8HulVpw9ucY+bwYZ6haQ9qvD4b/4JqQ7Z1NOwtafs0IfHf/J6IxUViKSXZI1tTWbePsxqTfgsHlqa3N/d0Yr+Z5G4dMq3pEpKKzJpLuzmKuqXdT95wrtFYPJOpOo81Jyk+7eSdmpxX7dPW1K1pZzVUn2jueGtra3VGlnxm/0NKXpUatZ4pU5z8kTtW5x4z29FfUrqtlOq4rtDY8jbk8t7mxoaPcT9txprxeWbCho9vTw6jlUfjsiatO+OPpz8ISnLhhFyl2Sye+30i4q7zSpR/i5/I6GlSp0o4pwjBdksFzUxYvLfprrfSbalvNOrL+Ll8jYRioxSilFLkkYLi9t7fPpKi4vdW7NVc61J5VvTUf4pc/kXcjOssm8nKMIuU5KMV1bway61ejTzGinVl35I0de4q15ZqzlLzMSTbSW7MXJ0x4pPb03V9XucqpPEPdjsjyGytdKr1sOovRQ/i5/I21vp9vax4ox4pr8UtzF8Tda7SeI0Vvp9au02uCHvS/RG4tbCjb4ajxT96W/yPWee5u6NuvtJ7+6t2fl3K5V6++WXiPQeS7vqNssSfFP3VzNVd6nVrZjT+zh4c38TwNlmH63jw/8A7PVd31a52b4Ye6v1PIll7cz1WljWuWnFcMPelyN3aWNG2WYrin7zLbI3lnjh4jWWelzqYlXzCHu9X9DdUaUKMFGlFRj4GQ197qVOhmNPFSp4ckZttcbcs69larClBzqSUY92aS+1OdXMKGYQ5Z6s8dxXqXE+KrLL6dkVo0Z1p8FKLlL/AAamMnt2w45j5qhsbDTJ1sTrZhT7dWe6x02FDE6uJ1PyRsFyGWX4zny/WKtOnClBRpxUYrojHc3FO2p8VV47LqzzX2owt8wp4nV7dF5mirVZ1qjnUk5SZmY79s4cdy81mvr2pdS39WmuUUYKdOVSahTi5SfJIy2lrUup4pr1Vzk+SOgs7SnawxBZk+cnzZu5THxHXLOYTUYNP0+NvidTEqv5I9z5kTnGEHKbSiubZotR1GVfNOjmNPq+sjOrk4yZclZ9R1LGaVs9+s1+hp3vzCTbSSyzc6dpqhircLMuah28zfjGO/8APHGLTtNc8VbhYhzUe/mbpYSwtkSavUtRVLNKg81Osvd/2Z82uFt5KyajqCt04UsSqv8A+TQTk5ycpNuT3bYbbbbeW+pstM091WqtdYp9I+9/o34xdpJxxXTNPddqrWWKS5L3v9G+SSSSWEuwSSWEtuiPBqV+rdOnSadV/wDyZ9uFt5KanfK2j6Om06z/APk59tybbeW922TJuUnKTbb3bZstL0/0rVWsvs+kfe/0a9O8k44nSrDjar1l6nOMX18Tdk42wavVb/0SdGi/tHza/D/se3C28lY9Wv8AGaFF78pyX+DTLflzBu9IsODFesvW/DF9PEvp38ceLLpVj6CPpaq+1a2Xuo2MmoxcpPCW7Y5Gi1W/9NJ0aT+yXN+9/ontwkvJkxaleu6qYjtSjyXfxPPbUZ16sadNbv8AIpCEqk1CCbk3hJHSafaRtaWOdR+0/wBC+nfLKcc1Ga1oQtqKpw+L7sre3MbWi5veT2jHuy9atChSlOo8RRzd3czuaznPlyS7Izpx48Lnd1jqVJVakpzeZN5bNlpFl6WSrVF9nF+qu7PLp9o7qth5VNe0/wBDpIRUIqMElFLCSFdeXPX8xdGl1e845OhSfqL2mur7Hp1W99BD0VN/ayW791GhMyJxYf8A1WSlCVSpGEFmUnhI6ayto2tFQW8ucn3Z5NJs/Q0/S1F9pJbL3UbGcowg5SeIrdslZ5c+11GK8uI21Bzlz/Cu7OZqVJVKkpzeZSeWZ7+6ldV3LlBbRXgeZh24+PrPPtSUeqKLYzIrOHVHbDP6plj9xVAhFjqwFkVJRioklEAirhEJkmaLFkURYzRZEoqSYosgCSD4bxeBHEy3Chhdj6/rK/b5NvCfSvExll8IDpfunefUUwxhlwPjh8lU4WOFlwX44nyVXhHCWA6Q71Xh8Rw+JYF6Q75K8PiOEsB0id8leEcJYDpDvVeHxHD4lgOkXvkrw+I4SwJ0h3yV4WRwsuB0h8lU4WMPsXA+OL8lY8AyAnxr8jGTl9y+CMInS/p8k+4rxMniZPCiOEayhvCnETxIjhZHCxvKGsKtlEmPDA+T9Pjl9VkBTL7jiZr5Inx1cFeIniRZlKzcbEgA0yAAARwokEslWWz0rwkNNFwZuEanJYxhNoyEOKM9LPTfyS+0KRKkivC+hGMDtlPZ1xy9MgMZKkyzkn2zeO/S4IUkSbll9MWWewAFRDSZDj2LAlxlamVnpRpogyEOKZzvH+Nzk/VVJ9SyaZVxZBO2WPteuOXpkBRNolS7m5nKxcLFgAbYCHFMkEsl9rLZ6UaaIMhDimc7x/jpOT9UBLi0Qc7NOsu/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQECAAAAAAEEhhUAAqhYqAi4IiSRQAAAAFAAA5G1srj0scP21z8fE1RanOVOalHmjWOWq5cvH3n/AK3lSCqQcZLKZp7ik6NRxfLo+5tberGtTUo/FdiLiiq1Phez6PsdMse08PLxcl47qtZa13QqZW8XzRuoSU4qUXlM0M4OE3GSw0emxufQy4Jv7N/kc8cteK9HLx9p2j23tsq0OKP3i5ePgahrDafM6BPK2PFqFrxr0tNesvaXcueP3GOHk1/NV027w1RqPb8L/Q2ZzaTfJZN1plWpXxSlF+k6N7ZMzOTxXTPit84x5dQtOFurTXqv2kunieBNppp4aOujYVZL1uFLxZqtT0aVv9rCWaT5pL2TGeeM+3bi4+SzVi1hdqvHhm8VF+Z65JSi1JJp7NM0tOioSUoylxLdbnTaVVt7mnwunFVo8098+KMf/wAjGRr/APh5W+LpzN/aO3lxQy6T5Pt4GCj6SE1KmpKS5NI+geipyhKDhHhaw1g5zU7CVpPijmVF8n28Gcrz/kenH/m1P6rPprneQ2SjNe0m/wAz3vTJVIuNVw4XzXM56jVnRqRqU5OMlyZ1Om38Lyn0jVXtR/VGbz5t4/8AJxub1HRXZz4uKU6T5SS5eDPPRpRpTU4Z4lyeTt5wjUg4TipRksNM5rU9PlaT44ZlRb2fbwZz+TK/bvOLCfTb6VdW91Dh9HCFZc1jn4o2MoRnBxkk4tYaZxVOcqc1OEnGSeU0dNpepRuoqnVxGsvlLyMZbrrjqeI1uqaZK3zVo5lR6rrH/RrYtxaabTW6aO25pp7o0WqaVwcVa1WY85QXTyMtPRpWqqrw0rlpVOSn0l/s3JwqNxperOnw0bp5hyU+q8yNSvZqelRr5q26UavWPSX+zn5xlCTjNOMls0+h2sZKSTi00+TR5NQsKV5HPs1Vykv1I00em6jUs5cPt0nzi+nkdPa3FO5pqdGSkvzXmcfc21W1q8FaOH0fR+RNrcVbaop0ZcL69n5ksWOxuKNOvSdOrFSiznNR0upatzp5nR79V5m407UqV4lF+pWxvF9fI95lpxCfVG507WJU8U7rM4e/1Xn3PRqOjwq5qWuIT5uPR/Q0NSnOlNwqRcZLoye1jtqVSFWClTkpRfJplLm2pXMOCtBSXR9V5HJWd5WtJ8VKWz5xfJnSWGp0btKOeCr7rfPyJpWov9Jq22Z0s1aXdc15o1x3Brr7SqNy3On9nVfVLZ+aI1K1Vhqta2xCf2lLs3uvJnQ2d5Ruo5oz36xezRyl1aVrWeK0Gl0kuTMUJyhJShJxkuTTwyVqO5e+z5GsvdHo18zo/ZT8PZfwPDY63OOIXUeNe+uZvbevSuIcVGanHw6GT05S6s69rLFWDx0kt0zAm001s0ds4qScZJOL5po1l5otGrmVu/RS7c4/6I08FlrNehiNX7WHjz+ZvbTUbe6woT4Z+5LZnL3VlXtX9tTaj7y3XzMCJpdbd2uZhubShcr7anGT97k/mczaapc2+Fx+kgvwz3/M3VprNvWSVXNKf8W6+ZLE1p5brQpLLtqnEvdnz+Zqq9tWt5YrU5Q8+XzOzhJSinFpp9VuJRUk1JJp80zO2pXEHrtdRurfaFVuK/DLdG+udHta2XCLpS7w5fI1dxolxTbdJxqrw2ZGtyvZba8nhXFJrxh9GbO3v7av93Wjxdns/wAzkKtKpRlw1YSg+0lgqSxdO85jnszjLe9uKGPRVppds5XyNjQ12tHCrU4TXdeqzNidW6rafa1s8dCGe8dv8Hiq6DRlvSqzh57ovQ1u1nj0nHTfisr8j30LqhVwqdanJvopb/Iyu7Giq6Hcw9iVOovPDPLUsLqn7VCp5pZ/wdfzHgSrMq4hpxeGmn4lkdq4xnHE4qS7NGCen2lT2reH9Kx/gzWpm5IywrVYexUnHyk0dDPRrSXJTh/LL6mGWg037Nea80mZamUauN/dx5XFT4vP+TPDVr1fvs+cV9D0y0GovYrxfnHBR6HcrlOk/i/oZq7xQtau1zcH5xMkdcuesKL+D+pi/wCHu1yjB+Uir0m9/wCnP9S+pmr/AC9a12v1p0vz+pb/AJ2t/wBVP8zyLSr3/p/+4/UstKvf+n/6j9TLWsXq/wCcr/8AXS/P6j/nLl8oUl8H9TzLSr3/AKf/AKj9Sy0q9z91j+pfUxdrJizPWrt8nBeUSHq15L96l5RX0Ijo92/wwX9Rmholy+cqS+L+hnys6R55X91LnXqfB4KSr1Z+3UnLzk2bGGh1PxVoryWT0U9DgvbrSflHBiytd8I0i5lkdBDRrWPP0kvOX0PVTsLWHs0If1b/AOTPU+WOWSbeFzM9OzuamOGjUx3awjq4QhBYhGMV4LBYdWby/kc7S0a5n7bhBeLz/g9dLRKa+9qzl/KsG3MVW4o0vvKsI+DY6xn5Mqw0dPtaXs0Yt95b/wCT1pJLCSwjXVtXtoexxVH4LH+Tw1taqy2pU4xXd7su5Dplk355695b0PvasU+yeX8jmq15cVtqlWTXZbL5GAnZucX63dfW4rKoU3J95bGuuNQua+eKo4x92OyPPTpzqyxThKb/AIVk2Fvo9xUw6rjSj47sz5rWscWtMlChVrvFGnKfkdBb6TbUsOadWX8XL5HvjFRilFJJdEi9Wbyz6aS20WTw7iaivdjz+ZtLe0oWy+yppPu938zPJqMW5NJLm2a+61a3pbQbqy/h5fMtkjG8s2wPFfX1C3XDOeZe7HdmlutTuK+Upejh2jt+Z4Jbs83Pn/Ov16f+fg3luvdc6pWq5VL7OPhz+Z4G23lvL7me3tK1w/s4Ph957I21rpVKnh1n6SXboeLcxe+5Y4NRbWta4f2cdusnskbi00ylSxKr9pPx5L4HvilFYSSS5JFK1anRhxVZqK8TFytccuTLLxGRbIwXN1Sto5qS36RW7ZrLvVZSzG3XCvefM1cpOUnKTbk+bZZj+tY8VvmvbeajVuMxj9nT7Lm/NnhM9raVbmWKcdusnyRu7PT6VviT9ep7z6eSLbI3cscPEa2y0ypWxKrmnD82bqjQp0IcNKKiv8mY8N5qFK3zFevU91dPMzba43LLO6eqpUjSg5VJKMV1Zpb7U5VcwoZhDk5dX9DxXNzVuJ8VWWeyXJFKNKdaahTi5SfY1Mde3bHjmPmqmxsNNnWxOtmFPourPbYabCjidbE6nbojZC5fjOfL9YqU4QpQUacVGK5JGO6uKdtT4qj8kubPNf6jC3zCnidXt0XmaKtVnWqOdSTlJmZjv2zhx3LzWa9vKl1P1vVguUUYKVOdWahTi5SfRGW0tKl1PFNYiucnyR0Fpa07WGKa9Z85PmzpuTxHXLOYTUYLDT42yU54lV79F5Ht5bsVJxpwcptRiubZoNQ1CVxmFLMaX5yMauVcZLyVn1HUsp0rZ7cnNfoaglJyaSTbfRG707TlTxVrpOpzUei/2b8Yx3/njjFpmm5xVuFtzjB/qbnkRE1epakoZpW7zPk59vIz5yefzyVfU9QVFOlRadXq/d/2aFtttttt9WS3nmbTTNO48VbhepzjF9fM36d9Tjiul6f6VqrXX2fSPvf6N4ljkDW6nqCop0qLzV6v3f8AZn24W3kqdU1D0KdKi81Xzfu/7NC3ltt5bDbby92zbaVp/FitXXq84xfXxZv076x48TStPzivXW3OMX/k3INTq1/wZoUH63KUl08Ce3DzyZK6tf5zQoPblOX6GoSbaS3b6EG90mw9ElWrL7R+yvd/2X07+OOMul2St4KdRfbSX9vge+cowi5SaUVu2w3hZfI0OqX3p5eipP7JPd+8ye3CS8lYtRvHdVfVyqUfZX6mK1oTuayp0+b5vsjHSpyq1IwgsybwkdLYWkbWlwreb3lLuW+HfLKcc1Ga2owt6MacFsuvdmO+u42tHie83tGPcyXFaFClKpN7L8zmbq4nc1nUn15LsjOtuXHh3u6rOcqk3Obbk3ltmz0ey9JJV6q9Reyu7PLpto7qr62VSj7T/Q6OEVCKjFYS2SJXTlz1OsXNJq956STo036ifrNdWenVr30MPRU39pJbv3UaIkicWH/1UkkAPQkkhhEFZR6oqZSso9UdcM/queWP3FCUAda5rIEIkwqUWKFkSiyJKlkZFkSiqJMUWRJCJM0fEAAfY3yIBGUMruTcXVSCOJEcSJ2i9b+LArxeA4h3i9MlgU4mOJk7w+OrgpxMcTHyRfjq4KcTHEx8kPjq4KcTHEx8kPjq4KcTHEx8kPjq4KcTHEx3ifHVwV4mOLwHeHTJYFeLwHEXvE6VYEcSGV3L2idakDK7gqAAAAAAAAI4URwlgZ6xqZWKcLGH2LgnxxqclYxl9zIRwoz0s9L8kvtXiZbiRHCRhjeUXWFWyiTGE2Wcn6l4/wAZAVUmSpI1M5WLhYkDPYGmQAAQ0iHEsDNxlamVjG1jmDIQ4oxeP8bnJPtVSZZSRVxZBO2WPteuOXpkBjTxyLKXc3M59s3js9LAJpg25gaTAAq49ir25mQGLhPp0nJZ7Y8llLuS49irTRjWWLe8cl088gYyVLuamc+2Lx69LghNMk6OYQ4pkglm1ls9KNNEGQhxyc7x/jpjyfqgDWAc7NOsuwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACSCUQAAAAAAAAQCWQVQABViShZEEgDGeSAAngk+hZU5PsjPaRZKoDKqXdk+iiueSfJGulYQeiMIroi6SXJGfkjU42O0qzo1MpNxfNG/pW1WrCM4JcLWU8mlNjpN7+zy9HUf2Uv8A5YnPlPTGX/Lhnd1lvNInVg5KUfSLljr4Gm/Z0m1JvK6cjtE8rK5Gr1ax4069FeuvaS6+JjLkyrthxY4TUeXSKlFNUa6zn2ZN/kb6FKnHlCK+ByRvNJv/AEsVRrP7Rey3+L/Zjvb7rcwxnmRi1ew4M16EfU/FFdPE1UW4tNPDXI6/ZrD5dTQ6rYegk6tJZpPmvd/0ZdWy0q/VzD0dR4rRX93ibFpTi4yScXs0zjITlCcZQbUk8po6XTL+N1DhlhVordd/FEblarVLCVrPjhl0W9n7vgeOlUlSqRnTk4yjumjsJxjUg4zScWsNM5vU7CVpPihmVFvZ9vBkXTdabfQu6e+FVj7Uf1R7akI1IOE0pRksNM4ylUnSqRnTk4yXJo6fTL+F3Tw8RqrnH9UZsal202pWErSfFHMqLez7eDPJRqTpVFOnJxkuTR2E4RnBxnFSi9mmc5qmnStJcdPMqL5P3fBhrTdaZqEbuHDLEay5x7+KPdKMZxcZpOLWGn1OKpzlCalBuMlumuh0ml6lG5Sp1cRrflIzYsrX6ppjt81aCcqXVdY/6NbFtNNPDW+UdptyfJmj1XSuFOtar1ecoLp5BrTPpWqqpw0rl4qclPpLz8TdHDG40rVnT4aVy8w5KfVeZLFlezVNKjWzVt0o1ebj0l/s56cZQk4zTjJbNM7WMlJJxaae6aPJqGn0ryOX6tVcpr9TLbR6dqNSzfC/XpPnHt5HTW1encUlOlJSX+PM5C5t6ttUcK0Wn0fR+RNpc1bWrx0ZYfVdGLNrK6+4oU7mm4VYpx/wc7qOmVLXM4ZqUfe6rzNzp+oUrxY9ir1i/wBD3LDWHyMq4pNp5WzXLBu9O1lxxTu8tdKnVeZfUdHU81LTEZc3T6Py7GinGVObjNOMls0+ZGo7enOM4KUJKUXummYru0o3cOGrHfpJc0ctY31aznmm8w6wfJnS2OoUbyOIPhqdYPmZsWNDf6bWtMy9ul7y6eZ4k8PY7fns+Rqr/R6dbM7fFOp7v4X9CbaeTT9YqUcQuM1KfLi/Evqb+3r0riHHRmpL/HmcdXoVbepwVoOMvHqKNapQmp0puMu6Fix2s4RqQcZxUovmmsmovdEjLM7SXC/cly+DIsdajLELpcL9+PL4m5hOM4qUJKUXyaexlY4ytSqUJ8NWDhLsyaNWpRmp0puEl1TOxr0adeHBWgpx8TTXmiNZlaSz/BL9GRtaz1x7Ruo/1x/VG6oV6VeHHRmpx8Di6tOdKbhVhKEl0awTRqzpTUqU5Ql3TJYO4wmmmspmuu9Ht62ZU/sp/wAPL5Hgs9cnHEbqPGvejs/kbq2u6Fys0aik+q5NfAg5y70u5t8vg9JD3ob/AJHiO5R5rqxt7nLq01xe8tmRrblra5rW8s0akoeT2+RtrbXZrCuaakvehs/kVudCnHe2qKa92Wz+Zq61vWt3itTlDzW3zJVnl1trqNtcYUKqUn+GWzPYcEj1219c2+FSqy4fde6+RixdOxnGM48M0pLs1k8NfSLSrlqDpvvB/oa+31+Swrikn4wf6Gzt9UtK2MVVB9p7ENWNbX0GrHLo1Yy8JLDPBX0+6o+3RnjvFZX5HXRaaTi00+qLLsZXs4blzJO0q29GsvtaUJ+ayeSro1pU9mMqb/hl9SbamTn6N3Xpfd1qkV24tj20tau4e1KE/wCaP0PRU0B/uq68pRPNPRryD9WMJ/yy+pK1uV7KevNfeUE/GMsHqp65bS9qNSHwyaGdnc088dCqkuvC8GDdPDWGZXUrr6eqWc+VZJ+KaPRC6t5+zXpPykjikWMnSO7jJSWYtPyJOETa5bMywr1Y+zVqLykzJ0duuxZcji43t0uVxV/vZljqN2l9/U+ZKvSuwRKZyC1O8X7+X5F1ql5jHp3/AGoxV6V1xKORWpXn/fL5In/kLt/v5/Mzavx12CLI4x3t0/8A9FX4SZV160vaq1H5yZm1fjdq2kstpeZjdzQh7VamvOSOMTb5vcsYtanF/wCutlqdpHnWT8k2YZ61bR9mNSXksHNR7FksvC3ZzuVbnFi3s9ceMU6C85S/Q81TV7qfsuEP5Y/U8lK1uKi9SjUa78J6aek3c/ahGH80voTyvXCPNUuq9T2602u3FsYjc0tDf72sl4RieqlpFrD2lOb/AIn9BqnyYz05w9FGyua2OCjPHd7L8zp6VvRo/d04R8UjKXqxeX8jQ0dEqvDrVIx8IrLPfQ0m1pYbi6j7yf6HubSWW0l3PJX1G1pZzVUn2juXUjPbLJ6oQjCOIRUV2SwWNJX1t8qFLHjN/oa6ve3Ff7yrLHZbInaLOK326K4vrehtUqri92O7Nbc63J5VvT4V70voacyULerXeKVOU/FLYm66Tjxnsr3Fau81akpeGdvkYupuLbRZvDuJqK92O7NpbWVvb49HTXF7z3ZOtpeTGeI0FtptxX3cOCHeWxsLfTKFLEp/aT7y5fI2tR4izx17mjbr7WaT7c38jwf9V/qYx24csrPDKkksLZIpVq06MeKrNRXiai51ecsq3jwr3pbs1lSc6knKpJyk+rZwmO/b048NvttbrVnvG3jj+KX0NXUqTqz4qknKXdilTnVlw04uT7I2lrpPKVzL+mP1NeMXT+eNrKNGpWnw0ouT8OhtrTSoxxK4fE/dXI2VOnClFRpxUYrokTOcYRcptKK6sxcrXLLlt9JjFRioxSSXJIx169OhDiqySXbqzXXmrJZjbLL99r/CNRUqTqzcqknKT6sTH9MeK3zXvvNTqVsxpZpw/NmuMtvb1LifDSi33fRG6s9Mp0MSq4qVPHkjW5i6244TTXWenVLjEp+pT7vm/I3dvQp28OGlHC6vqzOeK8vqVsnHPFU91fqZttcbllndPTOcacHKclGK5tmmvtUlUzC3zGHWXV/Q8V1dVbmeaktukVyRjpU51ZqFOLlJ9EamOvNdcOOTzVTY2GmzrYnWzCnzS6s9thpsKOJ1sTqduiNkLl+M58v1ipThGnBRpxUYrojHdXNO2p8VR79IrmzzX+owt8wp4nV7dF5mhrVZ1qjnUk5SZMcds4cdy81mvbypdTzLaC5RXJGGlSnWqKFOLlJmWztKl1PEFiK5yfJHQWtrTtqfDTW/WXVm7denXLOYTUYLCwhbLiliVV9e3ke3KSy9kitSpGnBzqSUYrqzQ6hqErhuFPMaXbq/MxN2uMxvJWbUdS480rd4j1n38jVExi5SUYptvZJG903T1RxVrJOr0XSP+zp4xdt48cYtM03GKtwt+cYP9TbsGo1PUcZpW8vCU1+hjza4+eSr6nqKpZpUHmp1l7v+zRt5bb5sM2+l6dyrXEfGMH/lm/Tt/PHEaXp3FitcL1ecYvr4s3RBrNU1BUk6VB/acpSX4f8AZn3XC75KarqHok6NF/afikvw/wCzREvfL6m30rT/AGa1deMYv/LN+nfxxxOlWHDivXW/OMX/AJZuCDT6rqHOhQfhKS/wie3DzyVXVr/0jdCi/U/FJdfA1kU5SUYptvZJFVlvC5m/0qw9BH0tVfavkvd/2a9R3tnHiyabZK1hxTw6slu+3ge2c404Oc2lFbtsNpJtvCW+Tn9Tvncz4Kb+xi9v4n3M+3DHG8lU1C7ldVc8qa9lfqUtLedzVUIebfZGKhTnWqRp01mTOmsraNrRUI7ye8pd2PTvnlOOajLb0oUKUadNYivzMOoXcbWjnnUfsoyXNeFtSlUm9ui7s5u4rzuK0qk3u+S7LsZ1ty48O93VZylOTlNtyby2yEQiQ9aUCCSCegBJAC5kIkCs49VyKmVFJxw9uR1wz34rllj9xVFkVJRusJJRAIq5JCBmixZFUSjNFkSVRJgfD9/EYZcH1743yb5PxThZPCWBekT5Krw+I4fEsC9InfJHChwokDrDtf1HCuwwuxIL1idr+owuwwuxIGobqMLsMLsSBqG6jC7DC7EgahuowuwwuxIGobqOFDhRIHWL2v6rwocJYE6w71Xh8RwssB0i98lOFjD7FwT44vyVjBkBPjX5P/FMvuOJlsLsOFE65T1TvjfcRxDiHCRwsf3D+KtxInJTD7EDvZ7h8cvqsgMeSeJl+SJeOrgrxeBPEjUylZuFiQMoGmQAACOFEglkqy2elXHsQ0y4M3CNzkrGTl9y+EVcexnpZ6a7432KXclNFXFkDvZ7OmN9MgKJtE8Xc1M5WLx2LAZT5A2wAACriiGmi4MXCVuZ2MZKkyzSZDj2MdbPTczxy9pUkSYwngszv2l459MgKqXctnPI6TKX053Gz2AAqIcUVaaLgxcJW5nYxkqXcs45KtYMauLpLjl7WTT5EmMspdzUz/WLx/iwCeQdHMKuPYsCWS+1ls9MbWAZGVcexyuGvTrjyS+1QAYdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgJNluFvoRVQXUH4E+j8TPaGmMGVQRKiuxO8XTCTwt9GzMSid1mLEoSfQlU31ZkBO9XrFFTXcsoRXQkE7VdRPCl0LEIky2BAglVIAI0FipKIsWCeGAFbjSL7hxQrPb8Mn08DcnIJ5RvNJvvSJUaz9dey31/2FYdWseDNeivV5yiuniatNppp4a6nW+fI0eq2HoG6tFfZPmvd/wBEqthpV+riPo6jxVX/ANGxlFSi4ySaezTONhKUJKUW1JPKaOk0y+jdU+GeFWit138URqVq9TsXaz44Jui3t/D4HjpzlSnGdOTjJPKaOtnGM4uMknF7NM57U7CVrLjhl0Zcn28GRputLv43dPhliNaPOPfxR7ZwjUg4zSlF7NM4ylUlRqRnTbUk9mjp9Nv4XcMSxGqlvHv4ojcrT6np8rSfFDMqLez7eDPHSqSpVIzhJxkt00djOMZwcJpSi1hp9Tm9U06VrJzp5lRfX3fMi6/G50zUI3cOGWI1kt138Ue9xU4uMknF7NM4qnOUJKUG4yTymjo9L1KNylTq4jW/KRGpXh1TTHb5q0E3S6rrH/RrE2mmnhrqdrz5mj1TSuFOtarbnKC6eRGtM+l6qqnDSuXifJT6Pz8Tco4Y3Glas6bjSuXmHJT6rzJYsr2appar5q26UavNx6S/2c/KMoTcZpxktmn0O1i00nFpp9UePUdPp3kc+zVXKS/Um2tNJpuo1LOXC8zovnHt5HTW9encU1UpSUov8jkLi3q21R060XF9Oz8i1pdVbWpx0pY7ro/Mliyutubelc0+CtFSXTuvI5zUdNq2j4o5nR95Ll5m80/UKV5FJerVS3g/0Pa0mmmsp80RtxMZOLUk2muqN5p2scqd38J/Uajo6ealmsd6f0NJKLjJxkmmtmmS+R3EZKSTi00+TR572xo3kcVFia5TXNHN6fqFazeIvip9YP8ATsdLZXtG7hmlL1lzi+aM2NRzd9p9azlma4qfSa5f6PLBuMk4tprk0dvJKUWpJNPmmaa/0WMsztPVl7j5PyJtVNP1qUcQu/Wj765/E3tKpCrBTpyUovk0zialOdKbhUi4yXNNGa0uq1rPioza7royWNOwrUadem4VoKUfE0l7os4Znavjj7j5r6nrsNYo18RrYpVPH2WbRb8jKuJlFwk4yTUlzTWDPa3da1lmjNpdYvk/gdTd2dC7j9rD1ukls0aK80evRzKj9rDwXrL4BrbZWWs0auI1/sp9/wAL+htYtNJxaafVHDcnh8z02l7XtX9lNqPWL3T+BLGnXV6NKvDhrQjOPiae70PnK1n/AES+pms9ao1cRrr0Uu/NG1hKM4qUZKSfJp5MkcbXoVaEuGtTlB+PUrFuLTi2muqO1nCNSLhUipRfRrJrLrRKNTMqEnSl25ojTX2msXNHCqNVY9pc/mbi11e2rYUpOlLtPl8zQXOnXNvlzpuUV+KG6PKF1t3UJKSymmn1RZpSTUkmnzTOJt7qtbvNGpKPgnt8jbW2vTjhXFNTXvR2fyM2GmyuNIta2Woejl3ht+XI1txodeG9Gcai7PZm2ttSta+OGqoyf4Z7M9iMm7HGVretQeK1OcPFrYxrkdzs1hpNHkrabaVt5UVGXeOxNt9nLUa1Wi80qk4P+F4NhQ1q7p+041F/EvoeqtoK50KzXhNfqeGtpF3Sy1TU13g8kXcrZ0dfpv76jKPjF5PdR1SzqYxWUX2lscnUp1KTxUhKD7SWCiM2L1ju6dSE1mnKMl3i8mRHBxk4vMW0+6PVSv7un7NxU8m8/wCSWHV2fIiUIz2nFSXisnMU9bu4+16OfnH6Hqp69L8dBPxUsGDrW3nY2s/at6fwWP8ABilpFnLlTcfKTPNT123b9enVj8E/1PRT1izfOo4+cWSr5ij0O2fKdVfFfQp/wNP8NeS84pnthqNpLlXh8djNC6t5cq9J+U0Zq7rVPQGuVx84f7I/4Kp0rQ+KZu1Vpy5Tg/Jl088iWL3rQ/8ABVv+2n+ZK0Kv/wBtP8zfonqYsO9aFaHW/wC2n+ZdaFU61oL4G9RKeOZmxe9aWOhPrcfKH+zLHQqf4q8n5RNo6sFznFebK/tVCPtV6S85omovfJ5IaHbrdzqv4pfoZoaTaR503Lzky71G0jzrw+DyUlq9muVRy8oszZFlzeinY2sPZoU/isnphCMFiEYxXgsGplrdBexCpL4JGKWuv8FBLzkYti9Mq3yLHM1NZupezwQ8o/UwTvrqp7VefweP8GLk1OKurnOMFmcoxXdvB5aupWlPnVUn2jucu5OTzJtvxBns1OKfbe1dbpr7qlKXjJ4PFW1e5ntFxpr+FfU8NOnOo8U4Sk/4Vk9dHS7qpzgoLvJk3a11wxeWrWq1XmrUnPzeShu6OiR/fVm/CKx+Z7qOn2tH2aSb7y3LMaXkxnpzVG3rVn9lTnLyWxsKGi1pYdacaa7LdnQJJLC5Bl6ud5b9PBb6VbUsNx9JLvPf8j3RSikopJdkeWvqFtRypVFKS/DHc1txrc3lUKaj4y3ZdyJ1yybyTUY5k0kupr7nVbajlRbqS7R5fM0Fe4rV3mrUlLwb2+RhfMxcm8eL9e+81W4rLEGqce0efzNc228t5bPXRsLiu1iHDH3pbGyttKo08Os3Ul25I/N5c53r9LjuPHhJGmoUKteWKUHJ/kjaW2kJYlcSz/DH6m2jGMIpRSilySRWcowTlNqMV1Zy72s5ctvpFKlClHhpxUV2SLNqKbk0kurNbc6tThmNCPHLu9kaq4uatw81Ztrt0ExtMeLK+a211qtOnmNBekl36f7NRcXFW4lmrNvsuiMSTbSSbb6I2NrpVSpiVd+jh26/6N6mLrJjx+WvhGU5KMIuUnySRtLTSW8SuXhe4v1ZtLe3pW8cUoJd31fxMraSy9kjNy/HPLlt9KU6cKcVGnFRiuiQq1YUYOVWSjFdzX3mqQp5jQxOXfovqaevWqV58VWTk/8ABJjamPHcvNe+81SdTMLfMI+91f0NY93lmSjSnWnwUouUvA3NnpcKWJ18Tn26L6m9zF13jxxrrLT6tziT9Sn7z6+Rvba3p28OGlHHd9WZPA815e0rVYk+Kp0ijFtyccsss7p6ZzjCLlOSjFc2zS32qSqZhb5jDrLq/oeO7u6tzLNR+quUVyRipU51ZqFOLlJ9EamOvbrhxSeaqzY2GmyrYnXzCn0XWR7bDTIUcTrYnU7dEbIXL8Zz5frFSnCNOCjCKjFckjFd3NO2p8VR79Irmzz3+owt8wp4lV/JeZoatWdao51JOUn1ZMcd+2cOO5eay3l3Uup5ntFcorkjFRpTrVFCnHMmZrO0qXU8QWIrnJ8kb+1tqdtTUaa85PmzVsniOuWcwmoxWFjC1jl+tVfOXbyPW2km28Jc2ytWpClBzqSUYrqzQahfzuXwxzGkunfzMydnGY3O7ZtS1J1c0qDxDk5d/wDRrEs8hCMpyUYJuT2SRvtO0+NvipVxKr+UTpuYu1uPHGPTdNUMVbhZlzUe3mbQk0up6lnNK3ltylNfoZ81w/rkrJqeo8OaNu/W5SmungjSg3Omadw4rXC35xg+nizXp3/njiNL072a1xHxjF/5ZuGEajVdRxmjbvflKS6eCJPLh/XJUarqGM0aD35SkungjTA3el6f6PFa4Xr84xfTxfiad/HHFtL0/wBElWrr7TnGL/D/ALNp0ywjS6rf8WaFB+r+KS6+CJ7cJLyVTVL/ANM3Rov7Nc373+jXQjKc1GCbk9kkRFNtJLLe2DoNLsVbw46izWa/tL6d7Zx4sum2ataeXh1Ze0+3geqrUjSpynN4jHdsSkoxcpNKKWW2c9qN87qfDDKpRey7+Jn24443kvlW+u5XdXie0F7Mex5iCTT1yamosCCUZqpRKIBBJPQglEDqSCCCVsy3NFSyeSDFJcLIRmkuJGF7M745do45Y6qyBCJKiUyxUsiUSixQsjIsiSqJMUfEwRxIjiR9f7R8k61YFeLwHEyd4vTJYFOJjLHyRfjq4KZfcjcnyHx1kBTcjDHyf+L8f/rIMmPD7E4fYd7+Hxz9XBTD7DD7Dvfw+Ofq4yY8PsMMd7+Hxz9ZAYwPk/8AD4//AFkBjGWPkPjZAUy+4y+4+SJ8dXBTiZPEy94nx1YFeLwHEi94nTJYEcSJyi7iaoACoAAAAAIwuxDiWBOsrUysV4SMPsXBm8canJWMZZkIcUZ6Wel+SX2qpMtxIhx7MjDQ3lF1hV00+QMZKbXUs5P1Lx/i4KqXcniRqZSsXGxIANMgayABVx7ENNFwYuErczsYyU2i+Eyrj2MdLPTczxvsUu5bOTG00CzOz2Xjl9MgKKXcspZNzKVzuFiQAaZOZVx7FgSyX2sys9MbTQMhDijncL9Ok5JfaFLuWTzyMbWAJnZ7W4S+mQFFLuXTT5G5lK53GwABplDjkq1guDNwlbxzsYyyl3Jcc8ijWDnq4um8c2TOQY1sWUu5uZy+3PLCz0sADbA0mUccFwZuMrWOVjGC7jko00crjY7Y5SgAMtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnD7E8DJuCoL8HiSoIneLpjBlUV2JRO5piw+xPCzKCd6umPgfccHfJkBO1NKcKJwl0LAm6ILEBGVSAAoAAAQAEgIBoAAEosULIixIACiBBJmtQABFW5klUWDRHmWTw008NFSy3QWN/pd8riPo6j+1X/ANI2LSlFppNPmmchGThJSi2pJ5TR0Om3yuY8M8Ksua7+IVrdTsXbT46azRf/AM+B4qU5U6ilBtSW6aOtnGM4uMknF7NM57UrGVtLjhl0W9n28CK3Gm30bqHDLCqpbrv4o9rjGcHCaUotYaZyFOcoSU4Nxkt00dFpt9G6ioyxGrFbrv4ojcrVanp8rWXHDMqL5Pt4M8lKcqc1KDcZReU0dfOMZwcZJOL2aZz2pafK1k6lPLov/wCSVW30zUI3UeGeI1kt138Ue+SUotSSaezTOLhJwkpQbUk8po6LS9SjcJUq2I1unaX+zNbxrw6pprt26tBN0uq6x/0a1Nppp4aOze6w+RpNT0vCdW1jt+KC6eRF0z6XqqqcNG5eJ8lPv5m5Rw5uNL1V0+GlcvMOSn1XmRqV69U0tVs1bdKNXrHpL/ZoJRlCTjJNSWzTO0TTScWmnumjxahp9O8jn2aqW0vqNrpptN1GpaPhlmdF849vI6a3rU7ikp0pKUWcfcUKlvUdOrFp/k/IvaXVW1qqdKXmnyZLGpXWXNvSuafBWjldH1Xkc3qGnVbN8Xt0nykunmb6wv6V5D1Xw1Fzg+Z62lKLTSaezTM+mnFwk4SUoNxkt008YN7pusKWKd28PkqnR+Zj1HR+dS0Xi6f0NK002msNdGFjuU00mt0zyX1hRvI5kuGp0muf+zQafqVW09V+vS919PI6S0uqV1Dioyz3T5ozWnMXlnWtJ4qx9XpJcmYac5U5qUJOMlyaOzqQjUg4zipRezTNJfaM1mdo8rm6b/Qisun60ninebP30v8AKN3GSlFSi04vk085OHlFxk4yTUlzTR6bK9rWkvspZh1i+TJY1K6q5taN1DhrQTxyfVfE0N9pFa3zKlmrT8Oa+BtrDU6F1iOeCq/wy6+T6nvMrHEHusdSr2mFGXHT9yXL4djeXumULrMscFT3o9fPuaK8064tcylHip+/HdfHsGnQ2Op0LrEVLgqP8Mv07nu6nCI2Vnq1xb4jN+lp9pc15MzYsb+8sKF3vUhifvx2ZpbvSK9HMqX2sPDn8jcWeo291hRnwzf4JbP/AGe1EalcRhxeHszPbXVa2lmjUlHw6P4HU3VlQul9rBOXvLZ/M091olWGZW8lUj7r2ZGnotNcTxG5hh+9D6G4t7ilcR4qNSM14PkcXUpzpScakJRkuklgQnKElKEnGS5NPDJod0jy3On21xl1KaUn+KOzNFa61cUsKrirHx2fzNxbata18Jz9HLtPb8yDwXOhVI5dvUU17stmayvbVrd4rUpQ8WtvmdlFqUU0013ROzWHumRduHR6be7r2/3NWUV2zt8jpLjS7Svu6fA31ht+XI1tfQakd6FWM12ksMy1KW+vVo7VqcZrutmbKhrNpU9qUqb/AIl9Dna1lc0M+kozS7pZXzR50yWLJK7qlVp1VmlUjNfwvJc4SEnF5i2n3TPbR1O7pezWlJdpbmdL1de0msSSa7M89XTrSr7VCGe8dv8ABp6OvVF99RjLxi8fU9tHXLWSSmqkH4rK/IzYapU0K2l93OpB+eUeapoNRfdV4S/mTX1NrSv7Wp7Fen5N4/yeqLUknFpruiLLY5iej3kM4hGaXuyX6mCVlc0/bt6q8eFnYIsZq964eScX6yafiiUds0mt0n5mOVtQn7VCk/OKI13ceiTrHp1nLnQh8Nij0iyf7prykzKzOOXRbkzpP+FtH/2LykP+CtffrL+pfQzWu8c9GT7v5luOXvP5m/Wh2y/HW+a+hZaHbP8AHW+a+hmxe8c+py95/MlPc6BaHbe/W+a+hZaJbe/VfxX0M2L3jn0SdHHRrVe+/ORljpNmudJvzkzFxX5I5hFlzOrhp9pHlQh8dzPC2oR9mhSXlFGbifLHIwTl7Kbfgj007S4n7NCp/bg6yKSWEkl4EozcV+X/AMc5T0m7njMFBd5SX6HqpaHU/eVor+VZ+hu0S2orMmkvEz1ifLk11LRbeKTnOpN+eEeqnYWtL2aMM+O/+SZ31tT9uvD4PP8Ag8tTWbePsRnN+CwTxD+8myilFYSSXZEmhq63Ue1KlCP8zyeOrqN1V9qtJLtHYnaLOLKunq1adJZqTjFeLweKtq9rT9mUqj/hRzbbk8ybb7sE7Nzin22tbWqssqjCMF3e7NfWuq1f72pKS7Z2+RejZXFbHBSlju9l+Z76GiTeHWqqPhFZJ5q/xi1BloW1au/sqcpLvjb5nR0NNtqOGqfFLvPc9iWFhci9Wby/jRW+iTeHXqKK92O7+Zs7ext7fDp01xe892emTUYtyaSXNs8FxqttS2jJ1Jdo8vmWyRjeWb0z9pmCvXpUI5qzUfPmaS51WvVb4MU4vtz+Z4JScpNybb7tn49x3ba/Uw4bry29zq/NW8P6pfQ1levVryzVm5P8kVpUp1ZcNODk/BGyttInLe4lwr3Y7svjF0/jBq4pyaUU230RsbXSqtTEqz9HHt1NvQtqVusUoJePVmclz/HPLmv089taUbdfZxWfee7Z6DxXWoUKGVnjn2iai61CtcZWeCHuxJJazOPLLzW2u9Ro0MqL9JPtHp5s011eVrl4nLEPdXI857LTTq1fEpL0cO8v0RvUxdpjjh5rxpNtJLLZsrPS51MSr5hH3er+hs7Wyo2yzCOZ+8+Z6jNy/HPLl/GKhRp0YKNKKivDqWqTjTi5VGoxXVnivNSpUMxp/aVPDkviaW5uatxLiqyb7LoiTG1nHjuXmvfe6q5ZhbeqvffP4GqbbeW22+5anTnVko04uUn0RuLLSowxO4xKXu9Eb8Yu28eOPBZWNW5afs0/ef6G+tbalbQ4acfOT5sypYWFskee7vKVrH13mfSK5mLbk45ZZZ3T0TnGEXKbSiubZpb/AFSU8wtsxj1n1fl2PHd3dW6lmo8R6RXJGGnTnVmo04uUn0RqY69uuHFJ5yUNlYabKtidbMKfNLqz2WGmRo4qVsTqdF0RsuQuf4zny/WKtOEacFCEVGK5JGG7uqdrDNR+s+UVzZgv9Rhb5hTxKr+S8zQ1ak6s3OpJyk+rEx2zhx3LzWS7uql1PM3iK5RXJGOhRnXqKFOLb/wZrKzqXU/V2gucmdBbW9O2p8FNeb6s1cpPEdcs5hNRhsbKnaxz7VR85fQ9UpKMXKTSS5tla9WFGm51JKMUc/f307qXCsxpLlHv5mZLa4443O7rNqWoOtmnRbVLq+sv9Guw20kst9CacJVJqME5SfJI3+n2EbdKdTEq3fovI34xdrceOaY9M05UsVa6zU6R93/Zsg8JNvkaTUtSc80rd4hycu/kZ9uGsuSsmqajzo278JTX+EacYy9uZvNM05U8Va6zU5qPumvTv444ppen8HDWrr1ucY9vE2xL5Gl1TUc5o0H4Skv8Ie3DzyVOqahnio0JbcpSX+EadZbwuZK3eEbzStP9ElVrr7Tovd/2X077nHFtKsPQpVay+0fJe7/s2WcLLewyaPVNQ9K3Rov7Nc5L8X+ie3CS8lV1W/8ATydKk/sk9373+jXkElerHGYzUSOhCJQaSSQSiKklEIIyLIEEkE9B1CJIoFsyCQi5WpHKz1JRKEurtLNsCLIVI4eVyZCO8u5tx1pJZFSQLEohAzoXJKokzofEuHxHCWB9d6R8k75I4UMLsSC9Yna/qMLsSANG6AAqAAAAAAAAAAAAAAMAARhdhhdiQTUXdRwojhLAnWL2qvD4kcLLgnSL3qmH2IwZAT44vyVjJy+5cjCJ0s9Vfkl9xXiZPEHFDh8RrKG8KniQyiuGQx3yns6Y30yAxkqTLOSJ8dXBXiJ4kamUrNwsSBlA0yAABghxRIJZKstnpRxZBkBi8c+m5yX7YyeIs4pkOJOuU9NdscvaVJEmNruOQmdntLxy+mQFFJllJG5lKxcLEgA0yEOKJBLNrLZ6UcWQZA1nmYvH+Nzk/VE2iyl3IcexVprmZ/rFvWOTIDGngspdzczn2xeOz0sAnkG3MIcUSCWb9rLZ6UaaIMhDjk53j/HScn6qpdy6afIo00QSZWeKtwmXpkBVS7ljrMpXK42ewAFRVx7FTIGs8zncJ9OmPJZ7Y02i6eSrjggzLcfbdxmXpkBRSfUunnkdJlK5ZY2Ae4BplVxxyKmQhrJzyw/HXHk/VAGsA5enWXYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYJwxsQC3COEnaCoL8KGF2J2goSky4J3FOFk8JYE7UV4ScIkE3QwACASiAgq4AI0AAAAAAAAAAAQSAJBCJIoAAAAAIkgkLAABQlEAC4IRJGgIEEqpABloLlCyCxIiwQFXLQlKE1KDakt00VTygRp0mm30bqHDLCqxW67+KPZOMZwcZpOLWGmcjTnKnNTg3GSeU0dFpt9G6jwywqqW67+KA1eoWMrabnDei+T7eB5ITlCalBtSW6aOrlFSi4yScXs0+potS0+Vu3UpJui/wD5JWo2ul38bqPBPCrLp38Ue9pSTTSafNM42EnCSlFtNbpo6DTNSVwlTrNKt0fSX+yNyvHqenOjmrQTdLqvd/0a1PDTTw0dijT6ppeM1rWO3OUF+hLF0yaXqiqcNG5aU+Sn38zcI4o22mao6fDSuXmHJT6rzJpqV7NU0tVs1bdKNXrHpL/ZoJRlCTjJNSWzTOzi1KKaaafVHj1DT6d3Hi9mquUvqRrTT6ZqM7R8Mszov8PbyOloVqdemqlKSlFnH3FCpb1XCrFxkvzMlndVbWop0nt1i+TIsrqrq2p3VPgqxyuj6ryOcv8AT6tpLL9ak+U1+pvrC+pXkPVfDNc4Pmj1tKUXGSTi+ae5G/bjITlCalCTjJbpo32m6xGo1TusRnyU+Sfn2MGo6O45qWiyubp9V5Gmaw8PmPZ6dz5Hjv8ATqV4uJ+pVxtNfqaTTtTq2uITzUpe6+a8jo7a4pXNPjozUl17rzMWabl25W7tKtpU4ascLpJcmY6NWdGop0pOMl1R2NWnCtTcKkVKL6M0V/o86eZ2uZw9zqvLuNq9en6zCpiF1iE/e6P6G3i+q5HD7p4ezR7rDUa1o0k+On1g/wBOxLGpXR3ljRu4/aRxPpNc0c/fabXtW21x0vfj+vY39jfUbuP2csT6wfM9nNbmVjh0bOw1etQxCr9rT8XuvibK+0ejXzKjilU7L2X8DQ3VrWtZ4rQa7Po/iPbTrLS8o3Uc0ZpvrF7NfA9PPZnDQlKElKEnGS5NPdG4stbnDEblccfeXP8A2ZsWNheaRQr5lS+yn4cn8DR3djcWr+0hmHvR3R1Ftc0rmHFRmpLquq+Bm5rD5EVxBsLPVbi3wnL0kPdl9Tb3mkW9fMqf2U/4eXyNLd6dc22XKHFBfijuiNRv7TVra4wpS9FPtLl8zYJ/I4VHqtb64tseiqPh917ommo66rRp1o8NWEZx8Uaq60OnLLt5uD92W6FrrlKeFcQdN+9HdG1o1qdaHFSnGa7pmSOVubC5t96lNuPvR3R5juEeW5061uMudJKXvR2ZGtuYt7mtbvNGpKHgnt8jaW+u1Y4VenGa7x2YuNCksu3qqS92ez+ZrbizuLf76lKK7818wviumttVtK23pOCXae358jYRkpJNNNPqjgjNRr1aLzSqSg/B4M2GncGGrZ29fPpaMJPvjD+Zz9DW7mGFUUKq8Vh/kbChrtvJr0sJ0380ZsNLVtCt5b0pzpv5o8VXQ7iO9OUKi88M3lG9tq/3daDfbOH8j0Iy1uuPq2N1S9uhNY6pZX5GDk8PmduiJ0qdVfaU4T/mimTazJxJeE5QeYSlF+DwdVPSrOovuVF94to81TQaD+7q1I+eGRrtGopajd0/ZuJ/F5/yeqnrd5H2nCfnH6GWpoFVfd1oS/mTX1MEtGvI8oRl5SX6krW5Xrp69UXt0IPybRnhr9P8dCS8pJmolp93Hnb1PgsmKVCtD26U15xaM01HRw1y1fONVecV9TNDWLN85yXnFnJ8uZZGavWOuWqWb5V18Yv6GValZv8A/RA44kyvSOy/b7R//op/MlX9r/7FP+445ciUZq9I7H/kLT/2KfzH/JWi/fwOQJRmr0jrv+Us1++X9r+hV6vZrlOT8os5VFkzNWccdM9btlyjVfwX1Mb16C9ihJ+csHPrfkZYUK0vYpVJeUWzFtamGLby16o/YowXm2zFLWLuXJwj5R+p5Yafdz5W8/isf5PTT0e7l7UIx85fQzdrJhGOd/dT9qvP4PH+DDKcpvM5OT8Xk2dPQ6j+8rQj/Kmz10tEor7ypUl5YRzsrXfGNDFlll7LdnTU9MtIY+yTfeTbPZSpwprEIRivBYJ1S80+nLUrK5q+xRnju1hfmeuloteX3k4QXbmzoQOsZvLWrpaNQj95Oc38ke6ja0KP3VKEX3xv8yta8tqP3laCfZPL/I8VbWqMfuqc5vx2RfET+8m1IlJRWZNJdWznK2sXM/Y4aa8Fl/meGrVqVXmpOU34vJOyziv26SvqlrS5T45dob/ma6vrVWW1GEYLu92aoz0LO4r/AHdKTXd7L5k3a6TjxntjrV6td5q1JS82YnzN3b6I3h3FTHhD6mwpWVvbxbp01xY9p7sxnLMbVnJjLJHN29hcV8OMHGPvS2Rs7fSaUMOtJ1H2WyNmY61anRWas4xXiz8m5WvbeTK+lqdOFOPDTjGMeyWCW0llvCRqrjWIrKoQ4n70tkay4uq1w/tZtrstkJhaY8WV9t1danQpZUPtJfw8vmam5v69xlOXDD3Y7HkPbbadXrYbXo4d5fQ3JI6zDHDzXjPVa2Fa4w1Hhh70jcW2n0KGHjjn3l9D2i5/jGXN/wDq8Vrp9G3w2uOfvS+h7TBcXNK3X2s0n2XNmnutUq1cxor0ce/X/RmS1zmOWfltbq8o2y9eWZe6uZpbvUK1xmKfBTf4V182eRvLbe7PRa2da5fqRxH3nyNTGR2mGOHmvMe+z0ypWxKp9nT8ebNpZ6fSt8Sa46nvP9D2kuX4xly//qw29vTt4cNKKXd9WXnKMIuUmlFc2zy3l/St8xzx1PdX6mju7urcyzUlt0iuSJMbWccLl5r33uq84W397/Q1MpOUm5Ntvm2TCEqklGCcpPkkbiy0pRxO53fuLl8TfjF2/njjwWVjVummvVp9ZP8AQ31ra0raHDTjv1k+bMySSSSSS6IwXd3StY5m8yfKK5sxbcnHLPLPwzzlGEHKbSS5tmlv9UdTNO3zGHWfV+R47y8q3UvXeILlFcjBTpzqTUacXKT6I1Mde3TDik85INjYabKtiddONPourPZYaZGjidbE6nRdEbMXL6iZ8v1ixwhGnFRglGK5JGG7uqdrDM3mT5RXNnn1DUYUMwpYnV/JGiq1J1ZudSTlJ9WSY79phx3LzWS7ualzU4qj26RXJFbehUuKnBSjl9eyMtlZ1Lqe3q01zkzoLa3p29PgpLC6vqzdy14jpnnMPEY7Gzp2sNvWm+cj0TlGEXKTSiubZWvWhQpudSWIr8znr+9ndSx7NNco/UzJtxxxud3WXUdQlcZp0sxpdX1keCMXKSjFNt7JItSpzqzUKcXKT5JG/wBOsI2sVKWJVXzfbyN+I7XKcc1GPTNPVDFSsk6vRe7/ALNjyDaSbbwlvlmi1PUHWzSoNqn1l73+jPtwkvJWTU9R4s0bd+rylLv4I1CWXhcyUm2kllvob3TNPVFKrWWavRe7/s36d7144jS9P9ElVrL7TpF/h/2bMct2aTVNQ480aD9TlKS6+RPbhJeSp1XUOPNGhL1OUpLr4GqICNR6ccZjNRZDqFzJDQiSAiKsCESiKnqWKolEolEor1LJkAkgkhDqSCCCYsuYy6exBLWVgw4w8MzFakcrKN4ZaumMpvyoCCTq5rIkqixKJRYoWyZsHxUFOJjLPrfyR8m+Orgpl+JGH4k7/wDh8f8A6yDK7lMPsOFjtfw6T9Wyu4yu5XhY4WO2X4vXH9W4kOJFeFk8I3kaw/U8SHEiOHxHD4jeZrBPEhxIjh8RwjeZrBPEhxIjhI4WN5GsP1biQyu5XhY4WO2X4dcf1bK7k5Xcph9hh9h3v4dJ+rgxgfJ/4fH/AOsgMeWTl9x8kT46uCnEyeIveJ8dWBXiRPEi9onWpAygaZAAAAADCI4USCXGVZlYrw9iMMuDN443OSsYy+5kxkjhRnpZ6a+SX2hS7kqSIcWVaaG8p7OuOXpkBjJUmizkn2zeO/S4KqRbOeRuZSs3Gz2AArIQ4okEsl9rLZ6UcSDIDF459Nzkv2xptciyl3JcSrTRnWWLW8cl00+QMZKkzU5P1Lx/i4IUkSbll9OdlnsABUVcexVprmZAYuErczsYyyl3JcV02KtNGNXF03jkunkGMlS7mpn+sXj16XATT5A6OYQ49iQSyX2stnpjaaC8DIVcexzuFnp1nJL7FLuWMfIJ4Ez17MuOXzGQEKSZJ0l25WWewhxTJAs37JdemNrAW3IyFXHsc7hZ5jrjnL4opdyxjJTx5DHP9TLj/FwE8g6uQUcexcGbjK1jlYxgu45KPbmcrjY7Y5TIABloAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABhgATwsnhJuCoLcJPCidoKAvhdiSdxTD7DhZcE70V4SeFEgdqIwuxIBNgACAAAAAAAAAAAAAAAAAAALIkquZYjUAAFAAAAAAAAAABC5liAiESAAoAAAQAEgANAAAlFihZEWJAAUQI7Ema1AlbEAirghciQ0mLJKF1uFgWpzlCSlBtSTymioIro9Nv43MeCeFWXT3vI9+E001lPozj4ycZKUW01yaN9pmoqvinWwqq5P3v9hY8up6c6LdWgm6fVe7/o1qeHlPkdhzRptT03Ga1stucoL9CNM2maop4pXLxPkpvr5m5i8o4g3Gl6q6bVK5eYclLqvMjcr16npirZq26UanWPSX+zQSjKEnGSaktmmdmmmk000+TR49Q0+ndx4vZqrlLv5ka00+majO0lwzzOi/w9vI6ShWhXpqpSkpRZyFxQqW9RwqxcZL8zJZ3dW1qcVN7dYvkyVZXVXVtSuqXBWWez6o5y/sKtpLdcVLpNfqb+wvaV3HMHia5xfNHqnGM4uM0pRezT6kb9uMpzlTmpwbjJcmjoNO1aNXFO5ajU5KXR/Q82o6Q4ZqWqco9Yc2vLuafkQnh3PQ8OoabSu1xRxCr7yXPzNPpuqVLbEKuZ0fzXkdFb16dxTU6UlKL/ACM1uXbkrm3q2tXgrRw+j6PyFvXqW9RTpScZLt1Our0adem4VYqUX3NDf6TUo5nQzUp9uq+o2abHT9Xp18Qr4p1O/Rm1OFNlYarWtsQn9pS7PmvJmbGpW7vtOo3eZNcFT31+vc5+8sq1pL7SOYdJrkzprS6o3UOKjNPuuq+BnlFSi4ySafRrJGnFRk4yTi2muqNzYa1OGIXSc4++ua8+5lvtFjLM7V8MvcfL4Gkq0qlGbhVg4yXRk9q7ShWp14KdKanHwLThGpBxnFSi+aaycXQrVKFRTozcJeBvLLW4yxG6jwv348vijNjUTeaJGWZ2kuF+5Ll8GaWvQq28+CtBwl49Tsqc4zipQkpRfJrcVaUK0HCrCM4vo0RXGU6k6clKnJxkuqeDcWetzhiNzHjXvR2Ze80RPMrWWP4JfozT16FW3nw1oSg/ENOwtbqjcxzRqKXh1XwM5w0JOMk4txa5NPBtLTWq9LEayVWPd7MzpY3N1pttcZbhwTf4obGoutGuKWXSxVj4bP5G4tNRtrnChPhn7stme1EajiHGUJOM4uLXRrBanUnTlxU5SjJdU8HY17elcRxWpxmvFbmrudDhLLtqji/dluvmTa7eW21q4pYVVRqx8dn8zbW2r2tbClJ05dp/U5+5sLm3y6lJ8K/FHdHlRNK7uElJJxaafJosjiKFxVoSzRqSg/Bmzt9crwwq0I1F3WzJpdN1cada18udKKl3jszXVtBzn0Fb4TX6o9VvrFrV2lKVKX8S2+ZsKVSFRcVOcZLvF5Mjl62mXdHOaTku8NzySi4vEk0+zO4K1KVOqsVYRmv4lklrUriTPRuq9H7qtOKXRPY6Kro9nU5QdN94s8dXQHzo10/CS/UzWpY89HWruHtOFRfxR+h7aOvr97Qa8Yyya6po95T5U1Nd4yPNUt61L72lOHnFoml8OmpazZze8pQ/mj9D107y2qexXpvw4sM4oklh1d5FprKeUSuZwkJyg/Uk4vweD0wv7qHs3FT4yyZ0dXaodTk6esXsedVS84o9EdduVjihSfwf1M2L1rpHFS9pJrxRR29CXtUab/pRpI69P8VCL8pY/Qyx1+H4rdryln9CGq2v7Favnb0v7UR/x9o+dvD5Gvjr1F86VRfIyLXbbrCt8l9TK6r2/wDGWf8A0R+bH/GWf/RH5s8q1y192r/avqW/5u1fSr/avqZq/wBPUtNs/wDoj82XWnWi5UIfI8f/ADlr7tX+1fUf87bY2hWfwX1M1dZNhGztlyt6X9iMkbeivZo015RRqnr1HpRqfkQ9ej+G3b854/QyvXJu4pRWEkvIsjn3r037NCK85ZKS1u5fswpL4P6mbV6V0yLI5OWrXkv3ij5RRilfXU/ar1PhLBm1r467FtJZbS8zFO8tqftV6a/qycfxyk8yk2/FkmLk3OL/ANdRPWLWHsylP+WP1PNPXF+6ovzlI0S3RmpW9ap93SnLxUWc7a1OPGe3uq6vdT9mUYfyx+p5KtxWq/e1Zy8Gz1UtJup44oxgv4pfQ9lLROtWt8Ir9SatXeGLSiMZSeIpyfZI6ajpVrT503N95PJ7KdOFNYpxjFdksDql5Z9OZo6ZdVcfZ8C7zeP9nvoaJFYdaq34QWPzNyUqVadKOak4wX8TwXrHO8mV9MNCxtqGOClHPd7s9Jrq+sW9PKhxVH4LCNdX1mvPKpKNNfNl3ITDLJ0EpxhFynJRXdvBr7vVbanGSg3Ul/Dy+ZoKlWpVlxVZym/F5MT6nHly3hXfi4Z2m3tuNVr1MqGKcfDd/M8EpOUm5Nyb6t5PVQsLithqHDH3pbGxt9Ipxw60nN9lsj8zcj9Hthg0sITqS4YRcpdksmxttJqzw60lTj2W7N1SpwpR4acFFeCLGbn+OeXNb6ee2sqFvvCGZe892elnjudRoUMri45do7mqudTr1sqH2cf4efzJJazMMs/Nbm5uqNuvtJrPurdmputVq1Mxor0ce/NmubbeXzMtvbVbh4pQbXfodJjI6zjxx81ik3JtybbfNsy29tVuJYpQbXV9Eba10qnDDrv0kuy5GyjGMYpRSSXRIly/Ey5pPTX2ml06eJVvtJdui+psVssLZIpVqwpR4qklGPdmpu9WbzG2WF7z/RE85OWss62dxcUrePFVkl2XV/A013qdStmNL7OH5s8M5ynJym3KT5tmS3tqtxLFKLfd9EamMnt2x45j5rCe2z0+rcYk/Up+8+vkbKz0ylRxKr9pPx5I2JLl+M5cv1i89ra0raOKcd+snzZlk1FNyaSXNs895e0rZPifFPpFczRXd5VuX67xDpFciSWsY4XPzWwvdVSzC23fvv8AQ1E5OcnKTbk+bZEYuclGKbk+SRuLHSuU7n4QX6m/GLt/PHHgs7KrdS9VcNPrNm/tbWnbQxTW/WT5szJKKSSSS5JGC7u6VrHM36z5RXNmLbXHLO53UZpyjCLlJpRXNs01/qbnmnbtqHWfV+R47y8qXUvXeIdIrkYKcJ1JqNOLlJ8kjWOOvNdMOKTzkg2NhpkquJ1040+kerPZYabCjidbE6nRdImxaLll+Jny/WKsIRhFRgkorkkYLy7p2sMzeZPlFc2ee/1GNDMKWJVfyRoqk5VJuc5OUn1ZMcf1MOPt5rJdXNS5qcVR+S6IW1vUuanBTW/V9EZbGyqXUsr1aa5y+h0FvQp29NQpRwv8mrZPEbzzmHiMdlaU7WniO83zk+pnqTjTg5zajFc2ylxXp0KbnVlhf5Oevryd1Pf1aa5RMybcscbnd1k1HUJXLcIZjSXTrLzPFCMpyUYJuT2SRajSnWqKFOPFJnQ6fYwtY5frVXzl9DdunbLKcc1GPTtPjbpTqYlVfyibBtJNvkVlJRi5SaUVzbNFqWoOvmnRbVLq/e/0ZnlwkvJU6nqHpW6VB4p8nJfi/wBGsDBt6ZjMZqAACpJRVEo1VT1JIZJlUksqiQJRYqiURVgiEOpkWATBBIQJIoSmVJCLFkVTJRlGKS4ZY6AyTWY+KMR3wy7RyymqksipKNIsSQDOh8WwuxIB9c0+RboACgAAAAAAAAAAAAAAAAAAAAAAABhEcKJBNRd1HCiOHxLAnSL3qnCxhlwT4418lYwZBhGfjX5P1TL7jiZbhRHD4jWUXthfZxE5RXhZGMDtlPZ0xvpkBjJyyzkS8f4uCvF3J4kamUrFwsSADTIAAIaTIcezLAlxlamVijTIMgwmYvH+Nzk/VE2Spdw49iGmjP8AWK/zkvlPkDGTlmpyfqXj/FwVUi2cm5ZfTnZZ7AAVENJkOPYsDNxlamVjGE2jJjJVx7GLhZ6dJnL7FLuWMbTXMZwJnZ7Lxy+mQFVLuWTydJlL6c7jZ7AAVlDjko00ZAYuErczsYyyl3JcexVpoxq4um8c1088gY84LKXc3M5fbGXHZ6WABtzGslHHHIuDNxlaxysYyVLBZpPzKtNHOy4+XWZTLxV088gYyyl3N45y+2MuPXpYAG3NDSZRpoyAzljK1jncWMspdw49ipz84uupnGQFFLHkXW/I6Y5SuWWNxA1lAGmVGsEGQq49jllh+O2PJ9VUAHN0AAAAAAAAAAAAwyeFk2IBbhHCO0FQX4UMLsTtBQnD7FwTuKcLJ4SwJ2orwonCJBN0AAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAst0VJQVYAEaAAAAAAAAAAAC5gASCESRQAAAAARJBIWAAChKIAFwQiSNABBKsSADLSUWKFlyCxJMSAFWABGkoJ4eUQWA3el6nx4o3LxLkp9/M25xht9N1N08U7htw5KXVf6I3K9eo6aq6dSgkqvVdJf7NBKMoScZJqS5p9DsINNJppp9UebULCndxyvVqrlLv5ka9tRpmoztWozzOi+nbyOjoVYV6aqUpKUX1ORrUalvVdOrFpoy2d3VtanFTez5xfJkqy6dPdW1O6pcFWOezXNHOX1jVs5+suKm+U0dDY3lK7hmDxJc4vmjPOEZwcZpSi9mmZb9uPpzlTmpwk4yXJo6HTdWjWxTuMQqdJdJfQ8Wo6VKnmpbJyp9YdV5dzVAnh3CNfqGmU7rM6eIVu/R+Zq9O1WdviFfM6XfrE6GjVhWpqdKSlF9URv25G4oVLepwVYuMv8AJa2uKttU46MnF9ezOruLencU+CtFSXTuvI5+/wBLq22Z081KXfqvMbVt9P1SldYhPFOr2fJ+RskcMbTT9XqUMQr5qU+/VfUzY1K2t/pdK5zOH2dXuuT8zn7q1q2s+GtFrs+j+J1lvXp3FNTozUl4dC9SnCrBwqRUovo0ZacbSqTpTU6cnGS5NM3dhrSeIXaw/fS2+KMd9orWZ2jyvcb3+DNPOMoScZpxktmmsD2sdtCcakVOElKL5NPJWvQpXEOCtBSj49DkrS7rWss0Z4XWL5M39lq9GviNb7Kp48n8TNmmnjvdFnDMraXHH3XzX1NVKMoScZxcZLZprDO1TysmK5tKF1HFamm+kuTXxJtXKW11Wtp8VGbj3XR/A3llrdOpiNzH0cveW6/0eK80atSzKg/Sw7fiRq2nFtSTTXRj2ruKc4zipQkpRfJp5RNSnCrBxqRUovo1k4y2uq1tLio1HHuuj+Bu7PXISxG6hwv3o7r5GLGl7vRKc8ytp8EvdlujT3NnXtn9rTaXvLdfM62jVp1oKVKcZx7pl9mmmsoNbcQe211K5t8KNTiivwy3Ru7rSLavlxXopd48vkam50i5o5cEqse8efyIsbO11ujUwq8XTffmjaUatOrHipTjOPdPJxLTi2pJproy1OpOlLipzlCXdPBNNO4XM81xp9tXealJKXvR2Zo7bWrinhVVGrHx2ZtbfWLWsvXk6Uu0lt8zOljyXGhPnb1c/wAM1+prq9hc0M+koywuq3R1lOcZx4oSUl3TyXIu3DovCcoS4oScX3TwdfXs7ev97Sg33xh/M19fQqUt6NWUPCW6Iu2vt9Xu6WPtFUXaaz+fM2FDX4vatRa8YP8ARnhraNdU8uCjUX8L+p4qtGrReKtOcP5lgi+HVUdVs6v73gfaawe6lUhUWYSjJd08nCloScXmLafdMzYad2DjqWo3dN+rcTf8z4v8nspa7cxwpwpz+GGZ0unRVLehVy6lGnJvq4ps809Js5/uuF94yZ4qWv0n97QnH+Vp/Q9dPWLOfOpKH80X+hDyw1NBoP7urUj54ZhloE/wV4vzjg21O9tqns16We3EkZ4SjJZi014Myu65yWiXUeTpy8pGOWk3sf3OfKSOqLIjXauQdhdx529T4LJR21ePtUaq84M7MGV7uL9HNc4SXmh8DtUWySr3cQWR25aJmr3cOi8cvbGTtiUZsX5HFqnN8oSfkjLC2ry5UKr8os7GLJRmxfkcnCwupcrep8VgzQ0q8l+6x5yR06LIzYfJXOw0W5lzlTj5tnohoUvx10vKOTdoOcYrMpKK8XgzqHfJrqeh0F7dSpLywj009LtIY+y4n3k2y8761h7Ven8JZMM9YtI8pSn/ACxf6mbIsuVe6lQo0/u6UI+UUjMaSprkF91Rk/5ng889auJexGnD4ZZi2L8eVdIiKlSFNZqTjFeLwcnUv7qp7Vee/RPH+DC25PLec9zFybnD+109XVLSn+8432isnjq630o0fjJ/oaUyUretWf2VKcvFInat/HjPb0VtTuqv7zgXaG3+zxyk5SzJuT7s2NHR7me8+CmvF5f5Huo6LQj95OVR9uSJq07Y4+mgR6qGn3Nb2aTS7y2Oko21Gj91ShHxS3+ZmNdWLy/jTUNEWzr1W/CH1PfCzoW8PsqUU+73fzM9SpCnHiqTjFd28Guu9Xt4Rap5qS8Nl8znzyfHV47lnnHrMdWtTorNWcYrxZoq+qXFTaDVOP8ADz+Z4ZSlKTcm231byfkzD9fozht9t1cavCOVQg5vvLZGsuLyvcZ9JN8PurZGGEJTkowi5SfRLJsLfSa1Teq1TXzZrUxdNYYNcem2sa9xvGGI+9LZG7t9Pt6GGocUvelueslz/GMub8a620qjTw6rdSXyR74pRWIpJLsUr16VCOas1FfmzV3Ort5jbxx/FL6Em8nPWWba1akKUeKpJRiurNXdast420c/xS+hqqtWdWXFUk5PxIpwlUko04uUuyRuY69u2PFJ5q1WrOrPiqScpeJFKnOrJRpxcpdkbO10lvErmWP4Y8/mbajSp0Y8NKCivAXKT0ZcsniNZaaSliVy8v3F9TaQhGEVGCUYrokTKSjFuTSS5tmru9VjHMbdcT958jHnJx/rkrY1qtOjByqyUY+Jp7zVZzzG3ThH3ur+hr61WpWnxVZOUvEmjRqVpqNKLk/A3MZPbrjxzHzWNttttts9VpY1bl5S4afvP9DZWelwp4lXxOXu9EbLCS25Euf4mXL9YvPaWlK2j6izLrJ8z0Zwm28JHnurulbR+0frdIrmzR3l9VuXhvhp+6v1JMbkxjhln5rYX2qxjmFtiUvf6LyNNOcpycptyk+bZEU5NKKbb5JG2sdKzid1t2gv1N+MXb+eOPFZ2dW6l6q4YdZPkb61taVrDFNes+cnzZnjGMYqMUklySMN3dUraGaj9Z8ormzFtyccs7n4jNOUYRcptKK5tmk1DU5VM07fKh1n1fkeS8vKl1L1niC5RXIw04SqTUKcXKT6I3jjr26YcWvOTGbPT9NlUxUuE4w6R6s9ljpsaOKlbEqnbojYEyz/ABM+X6xRCMYRUYJKK2SXQ897eU7WHrbzfKK6mDUNRjQzTo4lU79ImiqTlUm5Tk5SfNsTHftMOPfmslzcVLipx1H5Loha29S5qcFNeb6IzWFjUupZ9mkucvodBQowoU1CnHEUat16bzzmPiMdna07WGILMnzk+bMtWpClBzqSUYrqylzcU7em51XhdF1Zz17eVLqeZbQXsx7Ek25Y4XO7rJqF9K6k4xzGkuS7+Z4QDb0ySTUAAFAAECSAixVgEGBKJIJRFSSQgiKsSVRJKJRJVEkEkkEohBEgEExe5JUstyCximsS8GZERUWY+RcLqsZTcYwQiTu5rIkqixKPi5GV3K4Y4WfWO1/Hybpj+rZQ4kRwjh8RvL8NYfpxDi8BwjhQ/s/g4vAcXgTwocKGs13gjiI4mW4UOFDWX6nbD8V4mOJluFDhQ1l+r2w/FeJjiZbhQ4UNZfp2w/FeJk8RPChwoazN4I4vAcXgOEcPiP7P4OJE8SI4WRwsbyNYLcSGV3K8LGH2J2y/DpjftfIMYL8h8f8A6yApljiZfkifHVwV4hxF7xnpVgRlEl3KmrAAFQAADCfQjhRIJZKsys9K8JGGXBm4RuclYyU2XaRXhM9LPTXfG+xSJTTKuLIHbKezpjl6ZAY8voSpGpyRm8d+lwQpIk1LKxZZ7AAVENJkOPYsDNxlamVjG1gGQhxRi8f43OSfaFJ9SU0yriyCdssfa9ccvTICibJUjczlYuFiwANsBVxLAlkvtZbPSjWCDIQ4pnO4fjpOT9QpdyyeSjTRAmdntbhL5jICql3LLc6TKVzuNnsABWVXHsVfiZA9+Zi4S+nTHks9sabXIupZIcexUxu4t6xzZAUUmi6eTpMpXLLGwABplVx7FTIQ0mc8sN+nTHks9qp4LJplWsEGZlcfFbuMy8xkBVS7ljrLL6cbLPYQ1kkCzZLr0xtY5hPHIyFHHByuNnmOuOcvirJ5JMZeLfU1jn+s5Ya8xIJwxwm9xzVayUexm4UHFNbnPKS+m8c9eKwgyOOAcblp3l36Uw+w4WXBntRXhJ4USCdqIwuxIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFluiSq5liNQAAUAAAAAAAAAABEkErkQgAAoAABKIAEgANAAAlFihYixIACiBCZJlqBKIBFXBCJDSYklUWCwJRBJFSF2BBFjYaffztWoyzKl27eR0VCrCtSU6clKL6nHnos7ura1OKm9nzi+TI3K6a7tqd1S4Kq8muaOevbKray9ZcVN8ppbG/s7uldwzTfrLnF80eiUYzi4TSlGWzTFachSqTpTU6cnGS5NHQadqkK+KdfEKvR9JHi1HSpUc1LdOdPm49V9TVmdLLp2qNfqOmQuc1KWIVvyl5mu07VZ0cU7jM6fJPqvqdBSqQqwU6clKL5NEbl25GtSnQqOFWLjJdGZLS6q2s+KlLHdPkzp7m2pXNPgqxyuj6ryOfv9Nq2jcl69L3l08wreWGpUrpKL9Sr7r6+R7kcQm08rmbfT9YlTxC6zOHv9V59zOlle6/0mnXzOhinU7fhZobihUt6jhWg4y/ydfRqwqwU6clKL5NEV6FO4puFaClF9+gb1tyNvXqW9TjpTcZG/sNYp1cQucU5+9+F/Q8F/o9SlmdvmpD3fxL6ms678yXVJ4dxFprK3TMF3Z0bqOKsd+klzRzVjqFe0aUXxU/cly/0dDY6jQu0lGXBU9yX6dzOtNytLe6TXt8yp/a0+6W6+B4Dtjx3mm0LrMmuCp70evn3CtDZajXtWlGXFT9yW6+HY39lqtvc4i36Op7sn/hmhvNNr2uW48dP3o/qeMzZtXdnnurOhdL7aCb6SWzRzdlqdxbYSlx0/dlubyz1a3uMRlL0U+0uXzM6ajW3ei1aeZW8vSR7PZmsnCVObjOLjJc01g7VGO4t6NxHhrU4yXjzXxJtqOQo1alGfFSnKEu6Zt7TXKkMK5gpr3o7MtdaHzla1P6Z/U1Nxb1reXDWpyj58n8QrrbW+t7lfZVFxe69n8j0nCp4PfbapdUMLj449p7/mZ0sdNXtqNwsVqcZeLW/zNZcaFF729Rxfuz3XzL22t0KmFWjKk+/NG0o1adWPFSnGce8XkjUcrcafc2+eOk3H3o7o8x26PPcWVtcb1aUW3+JbP5kXbk6VWpRlxUpyg+8Xg2VvrVzT2qcNVeKwz03GhRe9vVa8JrP5mur6Zd0c5pOSXWG5Fbq31y3nhVYzpP5o2NC5o119lVhPwT3OJaabTTT7MlPBLF07stzWGjjaOoXVHHBWnjtJ5X5nvoa9Wj97ShPyeGZ0abqrp9pW9uhDPdLD/I8dXQreW9OpUg/HdE0dctp441Om/FZX5HupX1tV9ivTfg3h/mZq+WmqaDXWfRVacvPKZ5aml3lPd0W1/C0zrE8FiNTJxFSlUpbVKc4fzJoqdz0MU7W3qfeUab8XFE2vZxiLJtPKbTOqnpNlP9zwvwk0YZaFbS9mdWPxT/Qla7RooXVxD2K9VeUmZ4aneR5V5/Hc2EtAX4Lhrzh/sxy0Gt+GtTfnlGVljFDWb1c6kX5xRljrl0uapPzi/qUeiXa5OnLyl/oq9HvFypxflJGav8vTHXbhc6dJ/P6l469V60YfNnhel3q/cP5r6kf8ddr9xMi6jZLXp/8ARH+4sten/wCvH+41n7Bd5/8A9ep8if2C7/8AXqfIyusWz/5+p/0R/uD16r0ow+bNctPu/wD16nyLrTrt/uJmausXu/5246U6XxT+pV63dvpTXlE80dLvH+4f9y+pljpF4+dNLzkjNX+Vnq94/wB4l5RRSWo3cudefw2M0NEunzdJecn9DNHQqv4q0F5JszYu8Y18rmvP261SXnJlG23vubuGhR/FcN+UcfqZ4aLbL2pVZebRixrvjHPIsjqKel2cP3Kb8W2eqnb0af3dKnHyikZ6nyxylKjVqfd0pz/li2eulpl3Pf0XCv4mkdMSjNxPlrSUtEqvHpKsI/yps9lHRrePtynN+eEbFtJZeyMFS+tqXt14eSef8GdSJ3yq9Kyt6XsUYJ92sv8AM9BqqutUI/dwnN/JHjq61XllU4QgvmybkOmVdCYK11Qo/eVYRfbO/wAjma15cVvvK02uyeF8jATs3OL9b+vrVGOVShOb7vZGvr6tc1NoyjTX8K/U8EYynLEU5Pslk9tDS7qrhuHo13m8fkZ3a11xx9vHOcqkuKcnJ928lGs8jf0NEpx3rVJTfaOyPdG2o0IfZU4x8cb/ADOfLLMLW8OWTKac3Q064rbqHBHvPY2NDSKUcOtJzfZbI2ZjrVqdFZqzjHzZ+VcrXrvJlfSaVKnSjw04RivBFzVXGsQjlUIOb7y2Rrbi9r19pzaj7sdkWY2k4sr7by5v6FDKc+KXux3ZrLnVq1TKopU49+bNcZ7e0r3H3cHw+89kamMjrOPHHzWGcpTk3OTlJ9Wy1KlUqy4acHJ+BuLbSKcN68uN9lsjZU6caceGnFRj2SFzk9M5csnpqLbSHs7iWP4Y/U2lGjTox4aUFFeBdtRTcmkl1Zr7nVaVPKor0ku/Qzu5OW8s2wbSWW0kjX3WqUqWVS+0l36GpubutcP7SXq+6tkYEsvC5mph+uuPDJ7Zrm5q3Es1ZtrolyRijFzkoxTcnySPfa6XVq4lV+zh4838Db21rStlilFZ6yfNluUnpcuTHHxGrtNJlLErh8K91czb0aUKMFGnFRj4GR7I193qlKjmNL7SfhyRm7ycbcs691ScacHKpJRiurNReaq3mFtsvff6GuuLircT4qsm+y6IpThOpJRpxcpPojUx17dceKTzUTk5ScpNuT5tme0s6ty/UWIdZPkbGz0lRxO5fE/cXL4m0ilFJJJJckhc/wAMuWTxi89nZUrZequKfWT5nqbxuzBc3NK2jmrLfpFc2aO9v6tzmK9Sn7q6+ZmS1zmGWd2999qkYZhb4lL3ui+ppak5VJuU5OUnzbISbaSWWbax0tyxO5yl0h9TfjF31jxx4bOzqXUvUWIdZPkb+0taVtDFNes+cnzZnjGMIqMUlFckjDd3VK2hmo9+kVzZjtbXDLO53UZZyjCLlNpRW7bNJf6nKpmnbtxh1l1Z5ry8q3UvWeIdIrkeeEJVJqMIuUn0RuY/ddcOPXnJQ2mn6ZKeKlwnGHSHV+Z69P06NDFSriVXml0ibFC5/jOfL9YqxSikopJLojz317TtYb+tUfKJ59Q1GNHNOhiVTq+iNHOUpycptuT5tkxxTDj35q9xXqXFTjqyy+i6IxMA6PRJpBPQgAAAAAAQABRPUkhEoVREogkipJIRKAlAhEkVYIgIyLAhEkEhBEkUJiQOW4RclFUSjNRiksSBkqrKz2MSPRhdxyymqktkqCo+NAA+tvkQAAAAAAAAAAAAAAAAAAAAAAAAAAAwgAI4V2HCiQTrF7VXh8SOFlwZ6Rr5Kx4fYGQEvH+NTk/WPL7k8TLcKI4Sdcp6XtjfZxdycorwsjDHbKezrjfTIDGTllnIzeP8XBXi7k8SNTKVm42JABpkAAEOKKuJcGbhK1M7GNgyEcKMXC/Tc5J9qqT6lk0VcWQTtlj7Xrjl6ZAY8tciyl3NzOVi8dnpYEJpkm2ANJ8wAKuPYrjHMyAxcJ9Ok5LPbGngspdw49irTRj+sW/5zZMgxllLuamc+2Lx2elgMroDo5hDimSCWS+1ls9MbTQMhVx7HO4a9Os5N+KKXcsY8dwngTOz2XCXzGQEKXck6Sy+nKyz2ENZJBbNkulGmiDIVcc8jlcPx0x5P0Uu5Yph9iUmiTk17XLCXzFgSlknhXc6TKX043x7VKuPYyYROES2VZlZ6YMFlkytZ5lWsHHK3HzHWZzLxRLJPD3Kl1LPM1jy79sZYWeYjCJwgDe65ocexUuGsnLLDfmOmOevFVTx5F1uUawQngzjlcfFaywmXmLgJ5B2l25WaSUaxyLAzljMlxyuKgLOPYqcLjZ7d5lL6AARoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACxUlAiwAI2AAAAAAAAAAAEABICBFAAAAAEoEEhYAAKEogkgsAA0BAjqSrEgAy0lFihYLEkxfQgIKsACNJzsSQiSBEkqWI1F6VSdKanTk4yXJo6DTtThcYp1sQq/lI5wBqV263RrdQ0uFfNShiFXqukjw6bq0qWKdzmUOSl1X1N/TnGpBThJSi+TRG55cfVpTozcKsXGS6MzWV3VtKmaUvVfOL5M6W7taV1T4asd+klzRz1/p9W0bb9an0mv1IutN/Y39K7SUXw1OsH+h7dmt+pxMZNNSi2muTRutP1hrFO73XSa/UjUrPf6RCrmdtiE+sej+ho6tOdGbhVi4yXRnY05xnFShJSi+TXUx3VtSuYcNaOez6ojWnLWt1VtanFRm13XRnQ2Gq0bjEamKdXs3s/JmovtLrW+Z081KfdLdeaNeh7WV3J473T6F3lyXBU9+P69zSWOq1rbEJ/aUuze68mb+0vKN1HNKe/WL5ozY3K5290+vaNuUeKn78eX+jyLnsdtjK35M1l7o9KtmdDFKfb8L+hNrpr7HV61DEav2tPx5r4m+tLyhdLNGaz1i9mjlbq0rWssVoNLpLo/iYoycZKUW01yaJpZXcmvu9Kt7huUV6Kb/FFbfFGrstZq08RuF6WPf8AF/s3lrd0LmOaM031jya+BmzTTnbvTbi2y3HjgvxR3PGdujx3emW1zl8Po5v8UdvyJasaC01C4tcKnPMPdlujdWmtUKuFWTpS780au70i4oZcF6WHePP5Gv5PDWB7adzCcZxUoSUovk08omUYzi4zSlF9GsnF29zVt5Zo1JQfhyZt7XXWsK5p5/ih9DFivZc6Nb1culmlLw3XyNVc6TdUcuMfSRXWG7+R0NteULn7mpGT7cn8j0Ii7cQ04tppproy1OpOnLipylGXdPB2FxbUbhYrU4y8Xz+ZrLjQ6csu3qOL7S3Qajy22tXNLapw1V47P5mzttatqu1TipS8VlfM0lxpt1QzxUnKK6w3PJyZNNO4pVadWOac4zj3TyXRw8JyhLihJxfdPB76Gr3dLGZqou01+pnSunrUKVZYq04T80eCtotrU3p8dN+DyvzMFvr1N7VqUovvF5NhQ1C1rY4K0c9pbP8AMg1NXQq0c+iqQmuz2Z4q1hdUc8dCeO6WV+R1yfbkWIu3D4aeGsMlHaVKNKrtVpwn/MsnlqaRZ1M4puD7xkRZXM061Sl91UnD+WTR7KWq3lNJKs5LtJJmwqaBB59FXkvCSyeapodzFNwlTmu2cMzWtxkp69XWPSUqcvLKPVT1+k/vKM4/ytP6GoqabeU/aoTf8u/+DzypVKe1SnOP8ywRdR1FPWbOXOUoecX+h6aeo2k+VxTXm8f5ONRJNL1dxGvSn7FWEvKSZlW5wZaM5R9mTXkzGjq7xcyxw8bq4j7NeqvKbM0dQu1yuKnxkSxersupKOQjqd4v38vkmZFq16v33/zH6GV611pK5HJrWL3/ALV/aiy1i8f7xf2olOldYixyX/L3v/av7V9B/wAtev8Aff8AzH6GV6V1pZM5B6neP9/L8iv7fdPncVfhJozV6V2ROUlucVK5ry9qtUfnNlHJy9pt+bM2tTjdrK4ox9qrTj5ySMctRtI868H5bnHosjNrU446iWs2keTnLyj9TFLXoL7uhJ/zSwc8jLTo1ansUpy8otmLa1MMW1nrleXsU6cfPLME9Tu6nOs0v4UkUp6ZeT5UWv5mkeulold4c504r4sxd1qdI18qs6j+0nKT/ieQbylolJP7StOXksHspaZaQ5UlJ95PJi41flxjmoJyeIpt+B66Wn3VXGKMku8tv8nTU4QprEIxiuyWDITqzeb8aKjolR71asY+EVk9tHSbWnhyjKo+8me+TUVmTSXdnkrala0s5qqT7R3LqRntlk9NOnCnHFOEYrslguaWtra5UaLfjN/oeCvqV1VynUcV2hsTtCceV9ulrV6VFZq1Iw82ay61mhFNUYyqPvyRom3JtttvuyvC5PEU230Ry5rvCvRxcU7zb119TuKuUpKnHtH6nik3J5k233Z7KGmXNXGYqEe8vobGhpFGGHVk6j7ckfmbkfodsMfTRwhKcuGEXKXZLJ77fSq9TDqtU4+O7N5SpwpRxThGK8EXM3P8c7zW+nit9Ot6O/Dxy7y3/I9ixjCPNcX1ChlTmnL3Y7s1txq9SWVQioLu92TVrMxyzbmrUhSjxVJxivFmtudXjHKt48T96WyNPUqTqS4qknKXdvJEISnJRhFyb6JZNzCT2648UntkuLmrcPNWbfh0XwMSWXhczZW2k1J4lXfo49luza29rRt19nBZ957svaT0Xkxx8Rp7XS61XDqfZx8efyNvbWdG3X2cfW957s9J5Lq/o2+U5cU/djuZttcblln4es8d3f0bfMc8c/dX6moutRrV8pP0cO0fqeMsw/XTHh//AGem7vq1ztJ8MPdieXyPZaWFa4w8cEPel+hubSxo22HFcU/elzLbI3lnjh4jV2mmVKuJVs04fmzc29vSt4cNKKXd9WZjw3moUbfKT46nurp5mbbXC5ZZ3T2SkopuTSS5ts1N5qqjmFtu/ffL4Gvururcy+0l6vSK5IwRi5yUYpuT5JGpj+uuHFJ5pOcqk3KcnKT6szWlrVuZYpx9XrJ8ke+y0rlO5/sX6m3hGMIqMIpRXJIXL8MuWTxi81lY0rVZS4qnWT/Q9fLdmK5uKdvDiqyS7LqzRXuoVLjMY+pS7Lr5mZLk5445Z3b332qRp5hb4nPrLovqaSpOVSblOTlJ9WQlnZG1sdLcsTucxj7nV+Zvxi7ax448VnZ1bqXqLEFzk+SN/aWlO1himsyfOT5szwjGEVGCSiuSRhurqnbQzUe/SK5sz27OOWdz8RknKMIuU2lFc2zS6hqbqZp27cYcnLqzy3t5Vupet6sOkVyPKaxw/XXDi15oADbqAAAyCSAJIJRAAAAAAECSCSxUhBACUSVLIipJRUlEVZElSUSiUSQSiASyCUQESVLEExLFFsWRBbnzMDWG0ZkUqrdM3x3V0xnFQEDq5vjHEOLwHCTwo+r/ANvk38K8THEy2F2GF2HXL9O2P4rxMZZfCA639O8/FMvuRl9zIB0v6fJPxjG5kA+P/wBX5P8Axj3BkA+P/wBPk/8AGMZZkGB0/wDT5J+MeX3Jyy+PAjCHS/p3n4rxMcTLYQ4UOuX6dsfxXiZPETwojh8SazN4HEOJDhI4WN5GsKtlE5KYfYgd79w+OX1WQGMnL7l+SHx1cFOJk8Xga7xm4VYEcSJyi7lZssAAVAAARhdiOFFgS4yrMrFOFkYMgMXjn03OS/bGSpMs0mQ4k65T012xvs4iyaZTD7EDvZ7OkvpkBRNolS7mpnKxcLFgMpg2wDGQAKuPYhpouDFwlbmdjGSpMs0mQ49jHW4+m+2OXtKkiTGE8Fmf6l4/xkBVS7ljpLL6c7LPYACoq4p8irWOZkBi4StzOxjLKXclxzyKuL7GPOLpvHNdb8gUSZdeJZyz7YvHZ6AW4V3JwuxvtHNTGSrj2MuPAGbqrMrPTDwvsSk0ZWslWsHK9sfMdZnMvFEk+pOEVLKXcuPL+sZcf4nCABv25pe5RrBYGcsZWscrioWUu5LjnkUawctXB13M4yfIgqngsnk6Y5yueWFgSQDbCHHsVLhrPmc8uP7jpjyfVQpY5lsmNrBKeDOOdnitZYS+YsAnkHaXbj6TzKNY8iwM5YytY5XFQsmHHsVOXnCuvjOLghS6MsdplK45Y3FAaz5gCyX2S2elAXayUexwyx6u+OcoADLYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtzJKosRqAACgAAAAAAAAAAIkqtixCAACgAAEogASAA0AACUWKliNQAAAEIkzWoEogEVcELckNJiSVRYLAlEErmRUhcgQRYsT0IBGoHssryrayzTeYvnF8meMtFkqx1lle0ruPqPE1zi+aPU0mmmk0+aZxkJShJSg3GS3TXQ3Wn6unind7PpNfqZrpjVr7SFLM7XCfPgfJ+RpZwlTm4zTjJc0zsYtNJxaafVGG8s6N3DFSPrdJLmg1pzlneVrSWaUvVfOL5M6Kw1GjdpLPBV6wb/AMdzQXunVrVt446XvL9ex5IvD25kWXTuDX32l0bjM4fZ1O65PzRrLHV6lLELjNSHf8S+pvrevTuKfHRmpL/BGpXLXdpWtZYrQwuklyZihKUJKUG4yXJrbB2coxqQcZxUovmmae90VSzO0fC/ck9vgxtdKWOtSjiF0uJe+ufyN5QrU68OOlNTj4HGVaVSjPgqwcZLoy9CtUozU6U3GXdEsWV2koxnFxnFSi+aayjU3mi055lbS9HL3Xun9DHZa2niN3HD9+K2+KNzSqQqwU6clKL6pmfTbkLi2rW0+GtBx7Po/iY4ScWnFtNcmjtZwjUi4zipRfNNZNTd6LTnmVtL0cvde6/0LVeWz1mtSxGuvSx78mbu0v7e6WKc8S92WzOWubSvbSxWg0u/NP4mFPsZsXbuzzXNlQuV9rTTl7y2Zz1pq1zb4Tl6SHaf1Nza6vbV8Kb9FPtLl8zOmo8Nzoc45lbTU17stn8zV1qNSjLhqwlB+KOzi00mnlPkxOEakeGpFSj2ayTbUcUnh5Twz32uq3VDC4/SR7T3/M2tzotvVy6LdKXhujVXGk3VHLjD0ke8N/y5hW2ttboVMKtGVJ9+aNnRrU60eKlOM4908nE4abTTTXRloTlCXFCTjJdU8MzpXcIxV7WhcffUoyffG/zOct9YuqWFKSqR/iW/zNnb65QnhVoypvvzRGoV9DpSz6GpKD7PdGvraRd0s8MVUXeLOioXFGus0qkJ+Ce5mMrtxU6c6cuGpCUH2ksFTt5xjOOJxUo9msnjq6VaVd/RcD7weP8AQac1Rr1aP3VWcPJ4PdR1m7h7Uo1F/FH6Hqq6Cv3NZ+Ul+qPHV0e8p8oKa7xkQbCjr0dvTUWvGLye2lq9nNLNRwfaUWcvVoVaT+1pzh/NHBQml07ijcUauPRVac32jJMynBmelc16S+zrVIrspPBmxdO3RJyVLV7yH71S/mimemnr1de3Spy8sozo06CdvQn7dGnLzijDLTLOfOhFeTa/wa6nr8H7dvJeUsnop65ay5qrHzRldVklotnJ7KcfKX1MctBt/wANWqvPDM8dWspcq2H4xZnjf2suVxS+MsEq7rXPQI/huGvOGf1KPQJ/hrxfnHBuY3FF+zWpvykjLGUX7Mk/JkWZVof+Br9KtP8AMj/grnpOj839Dokyepmr2rnFoVz/ANlH5v6Flodz/wBlH5v6HQlkRe1c8tDuffo/N/QlaFc9alH5v6HRJkoyd60MdBrdatP8y8dBl1uEvKGf1N6mRKcY85JebMr3rUR0GP4rhvyjj9TNHQrde1UqvyaX6HvdzQj7VamvOaKSv7SPO4p/B5M2L2yYoaPaR5wlLzkz0Q0+0jyoQfnuYJatZx/e5fhFmOWt20fZjVl8F9TNX+q2dOjSh7FOEfKKRlT3NFLXl+Cg35y/0YZ65cP2IU4/BszavSulTLHIz1S8n++cV/CkjBOvVq/eVZz85NmbWpx12FS6oUvbrU4/1Hnnq9rD2ZSm/wCGP1OWiWOdrpOKN7U1x/uqPxk/0PLU1W6qZxNQXaKPJRtq9X7ulOS7qJ7aOkXU95KFNeL+hjzWtYYvHUqTqPNScpPxeSpvKOiU197VlLwisHto6fa0vZpRb7y3J1peXGenM0qNWs8Uqc5+SPdR0e5nvNxprxeWdGkksJLCBerneW/TWUdGt4b1HOo/HZHsVGnRp4pU4wXghWvLeh97Vin2Ty/kay61qnhqjTlLxlsjnza+OxrjmWeUbExVrilRWatSMfDO5oK+o3FXPr8C7Q2PI3l5byz8mYfr9KcP63VxrEFtQg5PvLZGtuL24r546jUfdjsjBThOpLEIuT7JZPfQ0mtPeo1TXjuzWpi3rDBrzNQta1d/ZU2136fM3lvptvRw3H0ku8t/yPYlhYWyJc/xnLm/Gpt9ISw7ief4Y/U2dGjToxxSgorwXMtOcacXKclGPdvBrrnVqUMqjF1Jd+SM+cnPeWbZHiudRoUcpP0k+0fqaa5va9xlVJ4j7q2R5zUw/XTHh/XrudQr18rPBDtH6nkPVbWFevhqPBH3pbG2ttNo0cOS9JPvLl8je5Grnjh4jUWtlWuN4x4Ye9LZG4tdOo0N5L0k+8lt8j2mG4uKVvHNWaXZdWYuVrjlyZZeIznmubujbL7SXrdIrmzV3Wq1KmY0F6OPfr/o1rbk8ttt9WWY/rWPD/8As9t3qVWvmMPs4dlzfxPCZ7a0q3L+zj6vWT5I3VnptKhiU/tJ93yXwLuR0uWOHhq7PTqtxiUvUp9318kbu1taVtHFOO/WT5s9B5Lu9o2yxJ8U/dXMzba4XPLO6eltJNvZI1l7qsYZhb4nL3ui+prry+q3LxJ8MPdR5Um3hJtvsamH6648X3ktUqTqzc6knKT6syWttVuZ8NKO3Vvkj3WWlSlidz6sfcXNm5pwjTgowioxXJIXLXpcuWTxHlsrClbJS9up7zXLyPaYa9enQhxVZJLp4mjvtRqXGYQzCl26vzMyXJymOWd2919qcKWYUMTn1fRfU0tSpOpNyqScpPqyoOmMkejHCY+kEFiGaaQAAAAABgAQSQSgIAAAABAAFEosVRKFURKIBFWJ6kAKsSVRKILBEEmRICBBLCAIVJMWQALiazFkFkT15SzbAiSJLEmgehxfGwAfW3yIAAAAjK7k2uqkEZXcZXcbhqpBGV3GV3G4db+JBGV3GV3G4db+JBGV3GV3G4aqQMoZLs0AAIAAAAAAAAYI4V2JBNRZbFeEcLLAnSNTOqNPsQZAZvGs5P1jyTxMthEcKJ1ynprvjfYpdycoq4sjA7ZT2dcb6ZAYyVJlnJGbx36XBVS7olNGplKzcbEgA0yDCfMACrj2IaaLgxcJW5yWMZKkyzSZDj2M9bPTffG+xSRYx4wBM7PZeOX0yAqm+qyWSyameNc7jYAtw+I4fM12jKuM8yrj2MuF2HwM2yrMrPTBh9iUn02M5VpdDlZfp0nJL7VWepZRT6lWsAzOXKey4S+YthE4RCl3LLwOkz7Odxs9oJIBWUOPYq1guSYy45fTePJZ7Y08FlJdQ49ipz/rB0/nNkIKp4LJpnTHOVzywsAAbYHFMo1guSYywl9N452e2NPBdPJVx7EHOW4OmpnFwVUu5bmdccpXLLGwJe5ANMqtYILkOPY5ZYfcdceT6opdyxjJTwMc9eKZce/MWBK3IOrklrOzKNYLEmcsJWscrixl08kOPYqcpbhXXUzi4IUu5J2xylccpZ7A1nlzAFm/ZLZ5ihKePIs1ko9jjZcLt2lmc0uCqeC+co645bcsseqA1kA1ZtnelWsEF3uirWDhlhp3wz2gAGHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsVJQqxYAEaAAAAAAAAAAACBHUCwAIoAAAAAlAgkLAABQlEEolFgAGgAhEqxIAMtJRYoWCxJMXsQFswsWABGkkkIkgLdElUWI1ABANLklYvoWMq9Vlf1rR4i+Kn1g+R0VjfUbuPqSxPrB8zkxGTjJSi2pLk0xpuV273WGau+0inVzO3apz938L+h5rHWHHELpcS99c/ibyjUhVgpU5KUXyaZG45GvQqUJ8FaDi/HqRRrVKM+OlNxl3R19ajTr03CrFSi+jNJfaNOGZ2rc4+6+a+pF09FjrUZNRulwv31yNzCUZxUoNSi+TTzk4iScZNSTTXNM9FpeVrWWaU2l1i90yWLK62vQpXEOGtBTj4mlvNFlHMrWXGvclz+Z67LWKNbEa32U/H2X8TZp53XInpv24ucJU5OM4uMlzTWC9vcVbefFRm4vw6nWXNtRuYYrQUuz6o015otSGZW0uOPuvZk2umez1uLxG6jwv348vkbijVp1oKVKcZx7pnF1ISpzcakXGS5prBajWqUZ8dKcoS7pk01K7aSUk1JJp80zW3Wj0KuXSzSl4br5HjtNcksRuYcS96PP5G5trmjcRzRqRl4dV8DPpXN3Wm3NvlyhxwX4obo8Z26Z5rnTra5y501GT/FHZk2sczbXde2eaNSUV25r5G3tddTwrmnj+KH0MF1olaGXQmqkez2ZrKlKpRlw1YShLs1ge2nYW13QuF9jUjJ9uvyPSjhItpprZmwttVuqGFx+kj2nv+ZixXTV7ejXWK1OM/FrdfE11xodKeXQnKm+z3RFtrlGe1eEqb7rdG0oXFKus0qkZ+TIrmq+lXVHL4PSR7w3/AC5niacW1JNNdGduylWjSrRxVpxn5oNSuMTw8p4Z7LfUrujhRrSaXSW5uK2i21TLpudN+DyvzPBW0S4hvSlCovPDI09FDXpLavRT8YPH5HvoavaVOc3B9prBzVa1r0PvaU4ru1t8zETSu4p1adVZpzjNfwvJkOFjJxeYtp90eujqN3S9mvNrtLf/ACZ0Ow5owVbK2q+3Qpt9+HDNHR16vHHpacJrw2Z7aWu0H95SqRfhhoi6Zp6LaT9lTh/LL6nnnoCx9nXflKP+z20dUs6mMVoxb95NHsp1qdT7upCf8ssmau656pod1H2XTn5PH+Tzz0y8hzoSf8uH/g60mJm1Zk4qdCtTfr0qkfOLRQ7orKnCftwjLzWRtrs4klHYSsrWXO3pfCCRSWlWUudBfBtfqZtWZOSLI6iWjWb5QkvKTKPQ7V/iqrykvoRe0c7Gclyk18TIq1Vcqk1/UzevQbfpVqr5fQf8DS6Vp/JGa12jSq4rdK1T+5k/tFb/ALqn9zNz/wABT/75/wBo/wCBhn7+X9pk7Rp1cVn+9qf3Mn0tR86k/mzcrQaf/fL+0vHQqX/dP5IzV7RonKT5tv4hcjoVoVv1qVfmvoZI6JaLrVfnJfQla7xzaLrkdNHR7Nc6cn5yZlhptnHlQj8W2ZsO8coXjlvZbnXwtLaK9WhSX9KM8IxisRil5IzYvyOQp21efsUaj8os9NPTLyf7lpeLSOoTLGbD5K5+nolxL2504/Fs9dLQoLHpK8n/ACxwbYrO4o0/vKsI+ckjOonfKvNS0i0hzhKb/ikeylb0aWPR0qcfFRPJU1azh+94n2imzzVNdpr7qjOX8zSM3S6yrdxJOaqa1cS9iMIeSyzzVb25q+3Wm12TwvyOdyjU4rXV1K9Kl95UhHzZ5K2r20PYcqj/AIV9TmU9yy3MXJ0nFPttq2t1ZbUqcYeL3Z4a17cVvvKs2uy2RNGyuauOCjLHd7L8z3UdEqPDrVIx8I7snmr/ABi1IjCdR4hGUn2SydLQ0m1p4couo+8n+h6nCMKfDCKiuyWDHNNYWtYcs7TTm6GlXFTeeKa8Xue+hpNCGHUcqj8dkbEwV7qjQX2lSKfbmz8nta9d5MsvTLCEKccU4xiuyWCxqK+sJZVCnnxl9DX172vXzx1HjstkWYWrOLK+2+uL23obTqJy92O7NZcavUllUYKC7vdmsMtC2rV39lTcl36GpjJ7dZx44+apVq1KsuKpOUn4srFOTxFNt9Ebe30frcT/AKY/U2dC3pUFilCMfHq/iLnJ6S8snppLfSq1TDqYpx8efyNrbWFChhqPFL3pbnrPLc31C3ypT4pe7HdmN2uVzyy8PSzDcXNK3Was0n26mnudVrVNqS9HHw5mvk3JtybbfVmph+tY8N+2yutWqTzGguCPd7s10pSnJyk25Pqy9C3q15YpQcu76I21rpMI4lcS437q5G/GLpvHjaq3t6txLFKDl3fRG2tNKpwxKu+OXZcv9myhGMIqMUoxXJIipUhShxVJKMe7MXK1yy5bl4iYpRSUUkl0Rjr16dCPFVmor82a271bnG2j/XL9EampOVSblUk5SfViY/pjxW+2wu9VqVMxoZhHv1f0Na3ltt5bMlChUrz4aUXJ/kjc2el06eJV8VJ9ui+prcxdbceONZaWNW5eYrhh7zN3aWVK1XqrM+snzPUljZbJHnurqlbRzUl63SK5szba43PLPwzmuvdUhSzChic+/RfU1t5f1bjMV6lP3V18zyGph+umPF95L1qs603OpJyl4lADbsAAAQyQUVBLIAAAAAAIBLIAkglEAGAAAACBJBKNRViEESQESQSRU9SUV6EkVZEkAlEkkIkgEsgnoQESQSQTEsU5MsQUqrdMoZam8DEdsLvFxymq+M5Yyy4PrPS/r5L3n4x7+JOH2LgfGfJVMPsOFlwX44fJVOFjhZcD44fJVOFjhZcD44fJVOFjhZcD44fJVOFjD7FwT44fJVMPsQZAPjX5KxgyDA+P/wBPk/8AFMvuOJlsLsOFE65fp3x/FeJk8XgOEcPiP7h/FOJE5RXhYw+w7ZQ6431V8gxjJfkPjZAUyyeIveM/HVgRxIJruallZuNiQAVAAAQ0uxDiWJwzNxn21MrGNxZBlwyeHuYuM+mpy/rCmy3EX9GvEjgM7uPprtjl7RxIkYx0GcE+a/cS8c+k4Y4WSpdyU0/A3OSVzuNiOEYRILusiS7BxQBLN+1ls9KuLILh4ZzvH+Nzk/VU2iykiHHsVexjeWLWscmQgongspdzpOSX2xeOz0kDnuDbCSHHsAS4y+1ls9KtYIMhVx7HK8evTrOSX2KXcsY2sBPAmdnsvHL5i4IUu5Y6zKX05WWe0BoAutoq445EFw0mcsuP8dceT9VUu5ZblWsELYkzs8VbhMvMXBCfck6yy+nKyz2BrIBbJfZLr0q1ghPBkKOPY45YWeY645y+KspZBQspdy48n1Uy49eYkEkHVyGslWsFiWYywlbxzsY08F08+ZVxwQc5bhXSyZxcEKXck7Sy+nGyz2EOOeRIFkvsls9KEp48izWSjWGcbLjXaWZzVZCCqeC6eTrjntyyxuKA1kA1Ztn0q1gJ4LcyrWDhlj18x2xy7eKsnkFFsXTyjphnvwxlhr0DZoA2wq1ggyFGsHDPDXmO+Ge/FQADDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3QkrEsRqAACgAAAAAAAAAAIkr1LEIAAKAAASiACJAAaAABZElUWI1AAAAAZagSiARVwQSGkx5ElU8MsGoFioILBcgFsyLEgAjUC/QoWiyVVgARoRntbmrbT4qM2u66M862LErUdLY6vSr4jWxSqePJm0W6ycOj22Oo17XEU+On7sv07EbldHdWdG6WKsPW6SWzRo7zSq1DMqf2tPuua+BuLPUKF1hRlwVPdl+nc9pGnFcj12d/XtcKnLMPdlujoLvT6F0m5R4anvx2f+zR3ml3FvmSXpIL8Uf1QVuLLV6FfEaj9FPtJ7P4mzTzy3RwuT2Wl/cWuPRzzD3ZbozY1K6qvb0biHDWgpL818TT3ehtZlaz4v4Zc/mem01mhVxGsvRS8d18zaRkpJOLTT5NGfTTjKtGpQnw1YShLxRWMnGScW1JcmmdpUpwqwcakYyi+jWTV3WiU55lbydN+690Wq8VprNxSxGrirHx2fzNza6pbV8Lj9HPtPb8znLmxuLbepTfCvxLdHnM62ru1uslalOFSPDUhGUezWTkLW9uLb7qrJR917r5G2ttdTwrmnj+KH0M6aj0XOi29TLouVKXhujV3Gk3VHLjFVI94c/kdDbXdC4X2NWMn2zv8jORqOJlFxk1JNNdGTGTi04tp90dnWoUq6xVpxmvFGur6JQnl0ZypvtzRNq1lvqt3R29J6SPae/58zZW+u03hV6UovvHdGvr6PdUsuMY1F3i9/keGpTnTlipGUX2ksEadhb31tWx6OtBvs3h/melHCnooXdeh91VnFds7fImljs+hgq2VtWz6SjBvulh/NGio65cQ2qwhUXyZsKOuW8vvITpv5ozpU1dDt5fdznTfzR46uhV4706kJrx2ZuaV7bVfu68H4N4fyZ6k8rJFclV027pe1Qm/5d/8HmlGUXiUXF9msHboOMZLEkmuzWSLtw6LI66rp9pU9qhT/pWP8HmnolrPPD6SHlL6hdtDTuq9P2K1SPgpM9MNWvIfvsrxime6egf9dx8JR/2YJ6Hcr2Z0pfFoyvhaGu3K9qFKXwa/Uzw/8ga9u3T8p/6PBLSr2P7nK8JJmGVlcx9q3q/2sy1NN5DX6P46VReTTM8NbtHz9IvOJzDpzj7cJR81ghE0uo62Gr2T/etecX9DJHU7N8riPxyjj0SZsXrHZq/tH/8Aopf3YMkb22f/AOij/ejiUWJomLt1dW7/AH9L+9D9qt/++l/ejiUWRmxejtf2u3/76X96H7Zar/8ARR/vRxgRKvV2b1C0X/6KfwZH/J2cedePwTZyCJM1ZhHWPWLJcqrflFmN63arkqr8o/7OYWxbrsZrUwjo3r1JezRm/NpGKWvT/BQivOWTTQpVJezTm/KOTPCxupcrep8Y4M1euL2y1u6l7KpR8l/sxS1O8nzrSX8qSFPSbyXOmo+ckemnodd+3Upx8ssw1vGPBO4q1PvKs5ecmyiN5S0KCx6SvJ/yxweqnpFpDnGU/wCaX0M3Fe8jmkZaVOpUeKcJS/lWTq6VnbU0uChTXi45Z6VsttkZ6p8rmKWmXdT904rvJ4PbR0So/va0YrtFZN4HJRWZNJeJm4xPkyrw0dHtoY4+Oo/4nhfke6jb0aP3VKEfFLc89XUbWn7VaLfaO/8Ag8lXXKayqVKUvGTwZ8Q1nk3JEmksvCXic5V1e6qZUXGmv4V9TxVK1Wq81akp+bM9mpxX7dNW1K1pc6qk+0dzW3Wt5i1RpY8Zv9DUFoUKtb7qnKXilscua7wrvxceMym1q19cVs8VVpdo7I8xsqOkVp4dWUaa7c2e+hpdvT3knUf8X0PzO0j9C8mOPpoaVKdWWKcJSfgj30NJrT3qyVNdubN7CMYRxCKiuyWCTNz/ABzvNb6eKhptvRw3Hjl3luexJJYSwkeavf29HPFUUpdo7s11xq9SWVQgoLvLdk1azMcs25lKMIuU5KKXVs8FxqtGnlUk6kvDZGkq1qlaWas5SfiyiTbwllmph+umPDJ7eq51C4r5Tnwx92Ox5T22+mV6uHJejj3lz+RtLbTaFHDkvSS7y5fItsjVzxx8Rpbe0r3H3cHw+89kbW20mnTw679JLtyRskklhFK1WnSjxVJqK8WZ72uWXJll4i0IxhFRglFLkkiKk4U48VSSjHu2aq51dbxt4/1S+hq61apWlxVZuT8SzG0x4rfbbXWrRWY28eJ+9Ll8jU1q1StPiqycn49CsISnJRhFyk+iRs7XSZSxK4fCvdXM34xddY8bWU4SqTUacXKT6I2tppPKVy/6E/8ALNpQoU6EeGlBRXh1LyaSbk8JGLnv05ZctvpWnThTgo04qMV0QqVIUoOVSSjFdWa+71WFPMaC45d+i+pp69epXlxVZuT/ACQmNpjxXLzWyvNWbzG2WF775/A1U5SnJyk22+bZANyad8cZj6AAaaAAAAAAAFEMgsQBAAAAAAQSGBBLICABgkCAAEAgCiSSCUKoiUR1JIqSSB0CrIlFSxBIIJRkSSiECCxCHQdSFSTHkQFswL81gwGYxT2kzfFfOnPOPjYIyu44kfXtx8g1UgjiRHEidovWrArxeA4vAd4dMlgV4vAcXgO8XpksCvF4Di8B3h0yWBXi8BxeA7w6ZLArxeA4kO8Tpl+LAjiQ4kXtDrfxIIyicruNxNUABUAAABOGOFk3BBGF2L8I4US2G9KcKI4TLhDHYzerUzsYeF9hwvsZiTFx/Gpy1hUX3JXmZMIjh8TOs56XvjfaFjqiVgjhZBO+U9nTG+mQgpkniZZyT7ZvHfpYEcSLbG5lL6Yss9oABUSQ4ryAJZL7WWz0q4sguSYvHPpucl+2NPBZS7hxIaaMf1i1/OSyYKEqT8zc5P1m8f4sAmmDcsvpiyz2EkAqIcV0KtYLk/4MXjl9Nzks9sa2LKXclxKtYOf9YOm8c185IKFlLubx5JfbF47PSQAdHNJVx7Eglxl9rMrPShKeC7WSjj2OVwuPmOszmXirJpgoSpdy48n6mXH+LAJ5B1l25J+RVx7Eglxl9rMrPShKlgs1kq1g43G4+XaZTLxVk8goWT7m8c9+2MsNekgA6OY1ko9i4ayYyw36bxzs9qp4LJ5KtYIOcyuPiulxmXmLgJ55g7Sy+nGyz2EOPYkCyX2S2elCVIs1nzKPY42XCu0szjIQVTwXzk645SuWWPVAayAas2yq1gJ4LvkUawccsevmO2OfbxVk8goXTz5m8M9+KxlhrzAkgG2FWseRC2MhSSwccsNeY7YZ78VZPIKF08m8M9+KznhrzAcwDbmq1ggvzKtYOGeGvMd8M9+KgAGHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcypKCxYAEaAAAAAAAAAAAC5AgCwAIoAAAAAlAhcyQ1AAACyKkolWLAAKgkBEqwABlpKLFCwWJLLcqI8wsWABGlgQiSCU9gVT3LEaCVsQgGlySsWWMrAlEELmVqLEkEoy1FjY2WrVqGI1PtYeL3XxNaiSNSuus76hdLFOeJe7LZnrOHTaeU8NGzs9Yr0cRq/aw8ea+JLG5W5u9Nt7nLlHgm/wAUdvmaa60q4oZcF6WC6x5/I3dpf290sU54n7stmetGfTTieuGei1u69s80ajiu3R/A6a6sbe5y6lNcXvR2Zp7rRa1PMqElUj25MbWPVaa5CWI3MOF+9HdfI29GtTrR4qU4zj4M4ucJU5uM4uMlzTWCadSdOSlTlKMl1TwTTUruDx3OmW1xluHBP3obGotdarU8KvFVI9+TNtbalbV8KM+CXuz2M2aVq7nRa9PLoSVWPbkzW1KU6UuGrCUH2ksHaoipThVjw1IxlHs1km2nEptPKeGe+21S6obKpxxXSe/+zbXOi29TLpOVKXhuvkay40e6pZcFGrH+F7/IK2NtrlOWFXpyg+8d0bO3uqFf7mrCT7Z3+Rxk4Spy4ZxcZLmmsMLbkZsV3aZE4QqR4ZxjJdmsnI2+o3VHCjWk49pbo2Vvrz2Vejnxg/0ZmxXuraTaVc4g6b7wePyPFW0Ka3o1oy8JLB76GqWlXGKqg+09v9HujJSinFpp9UyNRylbTbul7VGTXePrf4PK008STTXRnblalKnUWKkIyX8SyTbW3FmSlXq0n9lVnD+WTR0tXSbOpv6NwfeLweSroMedKu14SWSLK8VLV7ynzqKa7SR7KWvzX3tCL/leDzVNFu4+xwTXhLH+Ty1LK5p+3QqLHVRyiK31LXLaSXHGpB+WUeunqVnP2a8F/Nt/k5DDTw9mSTS6dxTrU6n3c4S/lkmZTgkZqdxWp+xVqR8pNEsNO3Lc0cfDU7yHKvJ+eH/kzw1q8jzlCXnExYunVIh06cvahF+ayc7DXq/4qVJ+WUZof+QP8VuvhP8A0TS6rcu0tpe1b0n/AEIp/wAfaPnb0/gsGujr9N86E15NMyR162zvTqr4L6k0uq9j0uzf7iPwbI/4my/6P/qX1MC1y0fSqv6f9llrVn70/wC0yeWZaTZf9H/3L6lv+Jsf+j/7l9TEtZs/fl/ayy1mz9+X9rJV8si0my/6f/uX1LR0qy/6f/p/UxLWbP35f2sj/mrRdZ/2mV8vTHTbNfuI/NmWNjarlb0/jHJ4f+ctekar/pX1I/5236U6vxx9SLqtnC2oLlQpLygjNGEY+zFLyRpHr0Pw0JPzlgq9fk/Zt4rznn9DK9a35ZHNS124fs06S+Df6mN6xeS5TjHyijNXpXVdSTj5ahdz53FT4PH+DFKrUm/XqSl/M2zNanG7KdxRp+3Vpx85JGGeqWcF98m/4U2ckiyMWtTjjo565Qj93TqS88I89TXaz+7pQj5vJp4RlN4jFyfgsnqpafd1OVCa/m2/yYtrUxxntlnqd3U51nFfwrB55VJ1HmcpSfdvJsKWiXEt5zpw+OWe2lodKP3lWcvJJGbLWpnjGiiZKdOdSWKcJSfaKydNR060p4aoxb/i3PZGKisRSS7JGbiXl/HN0dLu6nOCgu83g99HRFzrVm/CCx+Zt0yKlWnTWak4xXi8E6xi8mV9PPR0+1pY4aSk+8tzPUSUMJYSPHW1e1p54ZSqP+FfU11zrVWaapU4wXd7s5c2vjsjfFhllnG3PPWvbejniqJvtHdnPVrmtW+8qSku2cL5GI/KmH6/TnD+ttX1h7qhT+M/oa+vd16/3lRtdlsilGhVrPFKnKXkjYUNIqy3rTjBdluy+MWtYYNYZaFtWrv7KnJrv0+Zv6GnW1HdQ45d57nqWEsIlz/GbzfjUW+j9a8/6Y/U2VC2o0F9lTSffqZJSjBZm1FLq3g8NxqtCnlU81JeGy+Zndyc95Ztgee4u6NuvtJpP3VuzSXGpXFbZS4I9o7fmeN7mph+t48P62dzq85ZVCPAvee7NbUqTqScqknKT6tmShbVrh4pQcvHp8zaW2kJYdxPL92PL5l8Yt7xwainTnUko04uUuyRsrXSZPEriXCvdjz+Zt6VKFKHDSgorwRdtJZbwkTvv055ctvpioUKdCPDSgo+PVmVvCy+Rr7rVKNLKp/aS8OXzNTc3la4eJyxH3VshMbWcePLLzW3u9TpUsxp/aT8OXzNPc3da4l9pLbpFbJGAG5jI748cxQwSQzTYACIAAKAAoAAAAABDJBRUEkAAAAAAEAlkAGCUQAYJIAAAIIkgk1FSEEOpkSiSCQqSSvQkirIkqSSiSSESiCUSVJ6EAkgkgsnkrOOXkLZlhLcbuJZt8T4WTwssD6/0j4/8lV4Rw+JYF6Q75K8PiOHxLAdIneq8JPCvEkDrDvVeFDhLE4Y64ne/qnCOHxL8LJ4fEmsTvWPh8RwmThXiThE1ifJWHhY4X2MwJqL8lYuCXYcDMoM3FflrFwkpYMpGDPS/p8v7FCeJlsIjhJ1z/TthTi8CeJEcPiRwsbzhrCrZXckx4A+S/Z8c+quCuX3JUjU5Il46kBSGUamUrFxsAAVAkgAMIjh7EgzcJWplYq00QXDS6mLx/jc5P1VNolSHD2IaaJ/WK/zkunkgoSpM1OT9S8f4sCFIt5G5lL6c7LPaAAVBpMhxfQkGbhK1MrFCU2i7wVcexzuFnp0mcvsUi3kY2sBPAnJZ7Lxy+lwQpdyTrMpfTlcbPYSQCohx7FWsFyTGXHL6bnJZ7Y08FlLuHHsVZz/AKwdP5zZCCieC6kmdMc5XPLCwABtgaTKtNFiTGWErWOdjGWUu4cexU5+cHX+c2Qgqngsmmdcc5XLLC4hJANMocexUuGsnPLj/HTHk17VTwX58jG1gJ4M453HxWssJl5i4CeQdpd+nKzXtJVx7Eglxl9mOVnpQspdyXHJQ42XCu0szjIQVTwXzsdccuzlljcUBrIBqzbPpVrBCeDIUax5HHLC4+Y7Y59vFWTyChdPJvDPfisZYa8wJIBthVrBBkKyjjkccsNeY64Z78VKeQULRedjWGe/FTPDXmJJIB0c1ZLBBkKSWPI454a8x2wz34qyeV4goXTz5msM9+KznhrzAnoQDo5qtYILvkVawcM8denfDPfhAAMOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAXBVFiNAACgAAAAAAAAAALkSVLEIAAKAAASiAgRIADQAALIkqixGoEEgAAgZaCUQCKuCOZIaWW6BWL3LBqBYqSiAWW5AWzIsSSiARqJWzLFC0d0SqsAA0lAhEma1E9SxVEoNJJRACxZbPKNhaatcUMKT9LDtLn8zXEoy06u01S3uMLi9HP3Z7fme84ZHrtb+4tsKnPMV+GW6M2NyurrUKVeHDWhGa8VyNVc6HF5dtUcX7s918y9prdGeFXi6cu63RtKdSFSKlTlGUX1TyZ9NOSuLOvbP7Wm0veW6+ZhO2e/PkeK50u1r5fB6OXeG35FtVz9tfXFvtSqtR917o29trq2VxSw/eh9DyXOi16eXRlGqu3JmuqU50pcNWEoPtJYM+1dhb3lvcL7KrGT7cn8j0HCr8z22+pXVDaNVyiuk9zOmpXWVaVOrHhqQjNdpLJr6+jW1TenxUn4PK/M81vr0XhXFJrxg8/kbO3v7avj0daOez2f5kajS19EuIb0pQqL5M8NW3rUHirTnDzR2SJwmsPkTauIRelVnSeac5QfeLwdVW061rZ4qMU+8dv8AB4a2hU3l0aso+ElkjW3hoavd09nNTXaSPfR15cq1B+cX+h4auj3dPeMY1F/C/qeSrQrUvvaU4+ccEWOno6taVFvUcH2ksHspVqdVfZ1IT/leTiESnh7E01p3aJOMpXtzS9ivUXhxZR66WtXcPacJ/wA0fpgzodPOEKixOEZLs1kwVNOtKntUIL+Xb/BqqWvvlUoJ+MZHqpa5ay9pVIPxWSKvPRLSXs+kh5S+phloEX7FxJeccnthqdnPlXivNNHop3NGfsVacvKSZDbSy0GuvYq0n55Rhlo15HlGEvKX1OnRJm1duTlpl5HnQl8GmY3ZXUedvV/sZ2USSNdnEujVj7VOa84sq01zTR3BJNr2cOEdw4R6xi/gHRpdacP7UZq9nEosjs1Qo/8AVT/tRb9no5+6p/2om1mbi0WR2ioUelKn/aiypU1ypw+Rmr3cUXjGT5Rb8kdqkk9kl8C6M1e7jY29aXs0qj8osyxsbqXK3q/GLR1y5EkO7loaVey/cteckv1M8NFunz9HHzkdKgZq960UNCqP260F5Js9FPQqaxx1pvySRtuJJZbSXiY53dvD2q9Nf1IzYdsq81PR7SPOM5/zS+h6qVlbU/ZoU/is/wCTzz1Wzj+94n4RbMM9coL2KdST8cIzV/qtvFKKSikkuxZHPT12o/u6MY/zPP0ME9Wu58qih/LFGbVmFdWjFUuqFL7ytCL7N7nIVLitV+8qzl4ORjRi1ucf66mrrFrDPC51PKP1PLU1yb2pUYx8ZPJpEemjZ3NXenRm0+rWF8zFtdJhjPbNV1K6q86ziu0djzuTk8ybb7s2NHRa88OpKEF82e6ho1CG9SU5vtyRjVq98cfTQmanZXFVZhSlju9kdPRtaFH7qlCPjjf5mSp7LOXNNYWrhzf1NOfo6PN49NUUfCKye6jp1tSw+Difee5621FZk8JdWeStqNtSyuPjfaG5+Tu17O2eT1pJLCWEuwbWMs0tbWJyyqNNRXeW7PBWua1d/a1JSXbO3yLMKs4rfbf19Qt6OU58Uu0dzXV9XqSyqMFBd3uzWGaha16/3VOTXfkvmamMjrOPHH2pVrVKss1Zyk/FlFvy3Zt6Gj8nXqf0w+psaFrRoL7KnFPvzYuUnpLy4z00dvptxWw3H0ce8tvyNpbaXQpYc/tJePL5HvMNe5o0F9rUUX26/IxcrXK8mWXiMsUopKKSS6Iic4wi5Tkox7t4NRc6xJ5VvDH8UvoaytWqVpcVWbk/Eswv2uPFb7bm51anDKoRc5d3sjU3F1WuH9rN491bIwg3JI744TH0AA20AAAQyQBAAIgAAAAKoAAAAAAAohkFioAAAAAAIJDAglkEgQGCQIAAQCAKJRJBKFURKI6koipRJBIVKJRUnqQSiQDIklEIEFiAOpCpJXIggD4yCcrsMn135sXx3pkjD7E4Y4mOJmfmi/HThJ4URxMZZPmPjqcInCK5fcZY+U+OrArljLJ8kPjqwK8T7jLHyQ+OrArxMcRfkifHVgRxDi8C/JidMkgjiRPEh3idb+AGV3BrcTVgAAgAAAwANBwojhJBm4StTOxXhZBckzeOfTU5L9seSVJluFEcPZmeuU9Ndsb7OInK7lcMgd8p7OmN9Lgqm0Txdzc5IzeOxIGUSbll9MWWe0AAINEOPZkgzcZWplYo1gGQhxT8DF479Nzkn2hS7kp5KtMgnbLH2vTHL0uCqbRZSRuZysXCwBJBthJVx7Eglxl9rLZ6UawFsZCHHPI5Xjs9Os5JfaFLuW5mNrAWwmdnsuEvpcEKXcsdZlL6crLPaCcEAqIcexUuGsnPLj/HTHk/VU8Fk88irWCDEyuPit3GZeYuCFLuW+R2mUvpxuNntAayAWzaelWsEFyHHscsuP8AHXHk+qKXcsYyU8Exz14plx78xYBPIO0u3JPMo1gsDOWMrWOVxULKXcOPYqcvOFdfGcXBVPHkXOuOUrlljcUBrIBqzbMulWsBPBd7lJLBxyxuPmO2Ocy8VZPIKF08m8c9+KzlhrzAkgG3NEo45cipchrsccsPuOuGf1SLzzJKFk88zWGf1Uzw+4kAHRzRJFS5El1Ryzw+464Z/VE87MkoWTyXDP6qZ4a8xJJAOjmrJYIMhSSwcc8NeY7YZ78VZPKBRbF08m8M9+KxnhrzANZQBuzbCjWAXayij2OGWPV6MM9gAMNgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAi5QsgsSACNAAAAAAAAAAABAhcwLAAigAAAACQQiQ1AAAC2dipKJViwACoJARKsAAZaSixVbFgsQXTyipMQsSACNLEDoSQSgQuZJGkoLZkANMgKrkWMrAlEBcxWokkgnoRtYEIkKlAgkirBEILmRYsZKNWpRlxUpyhLungxhGa3G5tdbqwwriCqLutmba21G1uNo1FGXuz2ZyJJNNyu6InCFSPDUjGUezWTkLa+uLfHoqsuH3XujaW2u8lcUv6ofQzpdvZcaNbVd6fFSl4PK+RrbjRbmnvT4asfDZ/I3dtfW1xj0dWOfdez+R60ZacTVpVKUuGpCUH2ksFUdtOEZxcZxUo9msnir6TaVctQdOXeDx+Q2rn6F5cUMeiqzSXTOV8jY0NdrRx6anGa7rZitoVRb0asZLtJYPBWsbqjn0lGeF1SyvyIrf0NatamONypv+JbfkbClXpVl9lUhPyeTiCybTynuSxqO5RPgcfRv7qjjgrzx2bz/AJPdR12vH7ynCflszOljeVbK2q+3Qpt90sM8lXRbWe8HOD8HlfmY6WuW8vvIVIP5o9lLUbSp7NeC/m9X/JGmtqaDP91Xi/CSweaej3kOUIzS92S/U6aEoyWYyTXdPJYiyuOqWlxT9uhUS78LwYsYe53CIlThU2nCMvNZIu3Eg6+en2k/at6a8lj/AAYJ6NZy5RnHyl9SLtzcKk4exOUfJ4M8L26jyuKv9zZuJaDRfsVai88Mxy0CX4LhPzhj9SVZXihqt7HlXfxSZmjrV4ucoS84l5aFcfhqUn5tr9DG9FvFyjCXlIzVmmWOu3K5wpP4P6mWOv1utGn82eJ6Ter9znykvqQ9NvF/+eZGvDYrX59bdP8Aq/0XX/kHe2//AOn+jU/sF2udvV/tH7Hdf+vW/sZmwkjcL/yBf+s/7/8ARb/+4I/+u/7/APRpv2O6/wDWrf2MlWd1/wCtW/sZF1G5X/kC/wDWf9/+g/8AyBtbW3/3/o06s7n/ANat/Yy6srr/ANat/YzNa1G1evT6W8V/UVevVulKn8cmvjp92/8A89T4oyLTLx8qEvmjK6j1vXLp/hpL4P6lJaxePlOK8ooxx0i9fOkl5yRmhot0+bprzkZp/LFLU7yXOvL4YRjld3E161eq/wCtnvjoVZ+1WpryyzPDQF+K4+UP9ka3i0rk5P1m2/Ek6CGhW69qpUl8Uv0PRT0mzjzpOXnJmbF7xzCLwjKTxFNvwR11OytqfsUKa8eFMzxSikopJdkZ0fI5SlYXVTHDQqfFY/yeulo11L2uCHm/odGiTFifJWnpaEudWu34RieyjpFpDnCU3/FL6HqnWp0vvKkI/wAzweepqtpT/e8T7RWSWQ7ZV7KVClSx6KlCPksGVGkqa7BfdUZS8ZPB5qus3M/Y4Kfks/5M2xqYZV0y5GGreW9H7ytBPsnl/I5Spc16v3tWcl2b2Kdjncm5xfroqutUY/dQnN93sjwXOr3FRNQ4aa8FlmupxlN4jFyfZHsp6ZdVFn0fAu83j8uZw5r/ABXfiwwxym3jq1alV5qTlJ+LKm5o6NHZ1qrfhFY/M9tGyt6PsUo57vdn5lzj3Xlxnpz1G1rVvu6cmu/JGwoaPN71qiiu0d2bkNpLLaSXVmbnXO8uV9PNQsLejjhpqUu8tz1cuR4q+pW1LOJ8cu0N/wAzX19XqyyqMVTXd7smrUmGWTdzlGMeKclFLq3g8NxqtCnlQzUl4bL5mjq1alV5qzlJ+LKGph+umPDPt7bjU7irlRl6OPaP1PE228vdgG54dZJPQAAoAAAANAAAAAAhgkgAACIAAqgAAAAAAABDJBRUAAAAAAAEAlkASyCSADBJAAABBFlzKkmoqwIQ6mRKJRBIVKJRARFWQ6gklEoEIkgkkqSRQkjqSRHxvhQwgD651j432v6YQx4ADrDdNuyGPIAuom6fIY8gBo3TC7E4XZEAmobphdhhADrF3TCI4USB1h2v6jhQ4fEkE6Yr3yV4RwssCfHF+Sq4fYguSZ+Jr5f/ABjyTllsIcKHTKeqd8b7iOJjiXYcJHCT+4fxVuJE+RTDIL8lns+OX1VwVyxxGpyRLx1YEKSJyujNTKVi42AAKgSyABDiiOFlgZuErczsUGTIQ4ryOd47PTc5JfaFLuSmmVcWQO2WPs645elwVTaJUu5uckrF47EgJ5Bv2wDGQBZsQ49ipcczneOfTpOSz2om0WUu4cexVrBj+sW/5zXBRPBZS7nTHkl9sXjs9JBJBtzTzKuPYkEuMvtZbPShKeC/Mq49jlcLPMdZnL4qU0+YKEptFx5P1MuP8WATTB1l25a17CHHsSCXGX2stnpR7Ep4Lvco1g5XC4+Y6zOZeKsmmChZS7mseT9Zy4/xIJ+RB0cxrPMq1gsSZywlaxzuLGXTzzIcexU5buFdbJnFwQpdyx2xylccsbEBrIBbNpLpRrBKeC+NijWPI4ZY3HzHbHKZeKsnkFEXTydMc9+KxlhrzAkgG2ESjjkVLkSXVHLPD7jrjn9Ui87MkoWi+jGGf1TPj+4kAHVyQ12KlxJdjlnh9x1wz14qIvuSULRfRjDP6pnh9xIAOrkiS6oqXIkuqOWeH3HXDP6qYvPMFC8XnzLhn9VM8NeYEkA6OaslghPDMnQo1g45Y9fMdsMu3irJ5QKp4Lo3hltjPHqgNZXiAbs2zLryoC8lkoefLHrXoxy3AAGWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgALghbokjQAAoAAAAAAAAAACJIXMkgAAKAAASQEFiQAFAABZElUWI0EEgAADLYWRUlEIsQSA0stwRHsSGoFipKIBboQE+hFiQARqJWzLmMuuRKqQAGkrkCE9yTNaiUWK9CUGkkogBqLIkqWIqVyBC5kkrUSAgZaiUWKkolaWR6re/uaGPR1ZY7PdHkJIre0NeksK4op+MHj8jY2+p2lbZVVB9p7HJEmdNbd1FppNNNPqiUcTRr1aLzSqTh/K8Gwoa1dU/b4ai/iWH+RmxqOirW1Ct97ShJ92t/meKtottPLpudN+DyvzMNDXaMtqtKcPFbo2FG/ta2OCvDPZvD/MitRV0KtHPoqsJrx2Z46unXdL2qEmu8d/8HWpprKeUT1Iu3EtOLxJNPswdrOEJrE4xkuzWTzVNNs6nOjFP+Hb/BG5XKwlKLzFtPwZ6qeo3dPeNxUf8z4v8m3qaFQf3dSpHzwzzVNCqr7utCX8yaIrHS1u6j7Xo5+cfoeqnr7/AHlBecZHgqaReQ5U1JfwyRgnZ3MFmVCqkuvC8EVv6eu2z9qFWL8k/wBT0w1ayn++x5xaOSaaeGsMImjTs4XttL2bil/ckemFSEvYnGXk8nCIlGdLp3pK5nDQq1I+zOa8mZY3lzHlcVV/WzNi6dsEcdHUrxcrifx3Mi1e9X79vzivoZ0vV1yLHJrWLz/sT/pRda1ee9D+0ml06pcgjl1rd3//AE/7Sf8Am7v/APp/2ksOtdSSjlv+bu+9P+0f81ee9Bf0k0vWurfIHKf8xevlVS/pRD1W9f79/CKX6GavWutTLpnGvULuXO4qfB4KO7uJe1Xqv+tmV6O2KutSh7dSEfOSRxLnKXtSb82QStTB2U7+0jzuKb8nn/BhlrFnHlUlLyizlUSZrUwjpJ67RXsUqkvPCME9eqP7ujFfzPJpqcJz2jGUvJZPTT0+7m8K3qL+ZY/yYq9cY9M9Yu58pxh/LFfqYJ3dxU9utUa7cWx6KWjXcvaUIecvoeuloT/eV15RiZrW8Y0+cko6Olo1rHHFxz83j/B66VlbUvYoU14tZ/yY6nySOWpUqlV4p05zf8Kye6jpV3U50+Bd5PB0sdtlsi5OqfLfppaOhv8AfVl5RX6nvoaVaU+cHN/xvJ6pzhTWZyjFd5PB5auq2lP95xvtBZM2SHbLJ7adOFNYpwjFdorBNT2TTVtc/wCmj8Zv9Dw19TuqqadThXaGxw57LhY6cXHlcptv6lWFNZqTjFeLweOtqtvTyoOVR/wrY5+UnJ5k233YPyen6/TnDPtsa2rVp7Uoxpr5s8NWtUqvNScpebKA1JI6zGT0AAqgAAAAAAAAAAAAsAAFAAACGSAIABEAAAABVAAAAAAAFEMgsVAAAAAABBIYEEsgkCAwSBAACAQBYJRLIJFVIRBJFSSQSKqUSiCSB1LJkBGRJJAILEAkivjYK5fcbn1n5P8Ax8d+P/1YFcPsMPsPkv4fHP1YZRTDJw+xO9/F6T9Wz5DPkVw+xGGO9/DpP1fJOSmH2GH2HyX8Pjn6sCgHyf8Ah8f/AKuCmScvuX5T46sCuWOJl+SJ8dWBHEFIveJ0ySApIZRe0Z60ABUAAAJIADCI4SQZuErUzsVaZBcnzM3j/GpyX7Y08E8TLYTIcTPXLH012xy9p4kTzKNNECclns+OX0uCvEyVJdTc5JWLhYkDYG2AnGUQAIcexDTRYGLxytzOxQlSZZpMhx7bmOuWPpvtjl7SpJgoSm0Wcn6l4/xYEKXctzOkyl9OdlntBJAKiHHsVawXJ5mMuOX03OSz2xp4LKXcOPYq1g5/1g6fzmyEFE8FlLudMeSX253Cz0kAG2BrKKtYLAzlhK1jlYoWUu5Ljko1g5WXB1lxzXBRPBdM6Y5yueWFgADbA45KNYLkvcxlhL6bxzs9qJ4LJ5RVrBBzmVx8V0uMy8xcEKXck7TKX042WewNZ8wC2S+yWz0o9iU8FnuVawcLjcfMdscpl4qyeQUTwXTz5nTHPfiueWGvMCSAbYQ1gqXIlHscssPuOuOf1RS7klC0X3GGf1TLD7iQAdXIks7lC4az5nPPDfmOmGevFRF9GWMZMXjnyM4Z68Vc8N+YsCSDs5IkslS4azyOeeH3HTDPXiojLoyShaL6MmGf1Vzw+4kAHVyRJdipcrJYOOeGvMdcM9+KtF58wULp5NYZ78VM8deYEtZIB0c1WsMJ4LNZKPY4ZTrdx3xsymquCsXjyLHXHLs5ZY9aESXVEguU3ExurtQEyWCDz2aunpl35AARQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASixQst0RYkABoAAAAAAAAAAAIBASACKAAAAAJAQDUAAALIqSiVYsAAqCQESrAAGWlkSVRYLAsVJiFiQARpYgZJIJBC7EkbCYvcgBWQEIkyoSiAhWosgiCSNxYEIkKlEoqSRqLEogIixJJBKJWoEoglEaWJRVEoy0siXzKkkqxJZFR1yRpYsVJRFZqNarSf2VScP5Xg9tLV7unzmpr+JGtRYy1G8pa8+VWgn4xke2jrVpP2nOH80focsSiaV2dO9tqnsV6b8HLDPQmmsp5RwxanUnB5hOUX4PBnTWnc9CUcfS1G7pv1a8/6t/8npp63dw9r0c/OP0JpXTyjGSxJJrs1kxSsraftUKX9qRpoa/P8dCL8pYPRDXqP46VReWGQeyWk2Uv3OPKTMUtEtW9nVj5S/0TT1qzlzlOPnH6GaOp2cuVePxTRF8vI9ApfhrVF5pMo9A924+cP9m0heW0uVxS/vRmjWpy9mpB+UkZqy1onoNVcq0H5pkPQbnpUov4v6HRFlyM1ZlXNf8AB3a60n5S/wBEf8Ld9of3HTjxJtduY/4a89yP9xK0a8f4I/3I6hErmS1e1cwtGvPdh/ciy0W77U/7jpiUZO1c5HQ7p/ipL+p/QyR0G461aXwz9DoVzLIla7VoI6DN+1XivKOTLHQIr2rhvyh/s3OUvaeEVdelH2qtNeckZO1a6GhUF7VWo/LCM8NGtFzU5ecjPK+tY87il8JZKS1Wzj++y/CLMrur09Ms48qEX5ts9MLahD2KNOPlFGulrdrF7KpLyiYpa/D8FCT85YIurW8XMsmc3PXqz9ijTXm2zDLWLyXKoofyxRmrMK6tESqQhvOUYrxeDjp3lzU9uvUa7cRiy28ttvxM1qcbr6mo2lPnXi/5d/8AB5qmt0I+xCpN/JHNRLIxa3OONzU12q/u6UI+e55aupXdXnWkl2jt/g8JZGLW5jGVzlJ5k233bJMaLoxY6RdbodyFzJfU4cv+a68X+4dCSESfnV+gAAgAAAAAAAAAAAAAAAAAA0AAAAACGCSAAAIgACqAAAAAAAAEMkgogAAAAAAAEAlkAAT0IAAAAAAgiyKk9TSpZJARkWRKKokKlEogkipJKosSgSQiSCUSVJMq+OAA+uvjIAAAAAAAAAAAAAkjCAGjZhdiOFEgnWL2v6jhHCSCdMWu+SvCyMPsXBn44vyVQnL7lhwpk+Oz1V+SX3FeJkqQ4ewcWT+4fxU8SGxXDIHyWez45fVXBXLJ4manJEvHUgKSCNzKX0xZZ7AAVANJgCzZvSOHsQ00WBi8crc5LFCVJlmkyHHxMdMp6b745exSLGNrAE5LPZeOX0uCFLuSmmdJnK53GwABplLWSrj2JBLjL7WZWelGscwngyFXHscrx2enWckvsUu5YxtYCeBM7PZeOX0uCFLuWOsyl9OVlntBPMgFRDj2Klw13OeXH+OmPJr2qngsmmVcSDEyuPit3GZelwVUu5ZbnXHKVyyxuIADTKHHsVLhpM5Zcf4648n6hSxzJW5VrBCeCY53HxVywmXmLgJ58wdpZfTlZr2EOPYkEuMvsls9KEp48izWSrWDjcbj5dplM/FX2wQVTwWTydMc9ueWHUJIBthVrBBchx7HLLD7jrjn9UUujJKFovuMc/qmWH3Egkg6uQ455cyhcNZ8znnhvzHTDPXiqp4L9DGyU8eRnHPXitZ4b8xYE8yDs4jWShcNZOeeG/MdMM9eKrF4LmMmLwZwz14rWeG/MWBJB2cSSzyKFyJLO6OWeH3HXDP6pF9CShaLGGf1TPDXmJJIB1clZLHkQtjIUawcc8deY7YZb8VZPIKp4ZZPsbwy2xnj1A1nzAN2b8My68qFovoxJFTh5wrvNZxcCLyDtLubcLNXSSjWCwayTPHcXDLrVAHsDzvTLsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlcyABcEEkbAAAAAAAAAAAAAErkCFzJIoAAAAAEkEoLAABQAAWJKosRqBCZIIAAI2FkVJXMhFiCQGlgRF9CSNJJKk52AFiBEixIAI0mLLmMuiVUgANJQIRJmtxZElSUFSSiARqLIkqWCpBCJJWokBAy3EosVRKJVWJRUkyq3UEEkaSiSESStRYlFUSiLFkAmCNLInqVRYy1EklUSRVkSiqJIqUW8SpZEWJJKkoirqTXJtGSNaouVSa8pGJEoyrOrquuVeqv62XV5cr/9Nb+9nm6EmWnqV9df+zW/vZP7ddf+xV/vZ5SwV6f266/9mt/ex+2XL53FZ/1s8yJRixdM7uaz51qj85MOrN85yfxMSJRK1F0yVyKosjNVKLooSjNVclEIkyqxKZVEozWouSiEwZqrosUReJitRZEoqiTFWLovFmNFkZWMhOdiq5E9zhzf5rvxf7iUSVLI/Or9BIAMgAAAAAAAAAAAAAAAAACwAAUAAAIZIAgAEQAAAAFUAAAAAAAUQyCSAAAAAAAQSGBABIEAAAAAgSiAWKsgQSKJJRVEoirIIgkKkkhEolBEoBGRIAIPjuUMorwjhPrHbP8AHx7rh+rcSI4l2HD4jh8SbzNYHEhxDh8Rw+I3mawOLzHEhw+I4RvNdYHEuxPEivCOFjeZrBbKGUV4WOFjtl+HXH9WyiclMPsQPkv4fHP1cFCcvuX5f/D41gV4mOIvyRn46sCOIniRZnKnW/gBlA1tkAAAeYADCI4fEkGbhK1M7FcMguOZi8f43OT9VTaJ4vAcK6EOLJrLFd4ZLJoFAngs5P1Lx/i4IUu5KaZuZysXGwABplJGE/AAlkvtZbPSriyC4ayYvH+Ok5P1VNospIhx7FTG8sWtY5MhBVPBKl3Ok5JXO8dnpIJINsJKuPYkEuMvtZbPSjWAngyFXHscrhZ5jrOSXxRS7ljGSnguPJr2l49+YsAnkHWXfpzss9gaTAFkvsls9KtYIWxk+RVx7HHLCzzHXHOXxRSJKEqWC48n6mXH9xYBPIOsu3JLKuPYkGcsZWscrioWUu5LWSnI5WXCuu5nGQgqngsnk645yuWWFxCSAaZVawQZCrj2OOWGvMdsc9+KJ5JKFlLuXHP6qZYfcSCSDq5DWfMoXDWTnnhvzHTDPXiqxeC5jexKeDOOevFayw35iwJ6EHZxGslGsFw1kxnhvzG8M9eKqngtzKNYJTwYxy6+K3lh28xYE9CDs4jWfMoXDWfM554b8x0wz14qsX3LmMtF458jOGevFXPDfmJAB2ckSXVFS5El1Ryzw+464Z/VTF5BQunleJcM9+KmeGvMCXuQDo5qtYCeCzWSnI4ZS43cd8cu01WQgrF4LHXHLtHLLHrQiS6kklyx3Exy61jLp58yslgJ4ZxxvW6rtlJlNxYE9CDu4ElnzKFyJLqc+TH7jrhl9VUAHF2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABKLFC3QiypAAaAAAAAAAAAAAJRAQEgAigAAAACQEA0AACSxQlEWLAAKjqSAStQABlViSq5lgsEWKkxDUSEARViAiSCQRFkkbC0WR0ICsgIySZVBYgRFaiyJXMqSRuLAIBUolFSSNJLEBEWJJIJRlqJJRUlBpYlFUSjLSxPUqSRYlFlyKkojUWRJUlGVWRKKlkyNRJKKkojUSWICI0sAgiCyCIJI0uCqJIqxboURZGSJRYqSmZrcWRKK+JJFWJIJRKsSiUVLIysWRZFEWRlpboSiEyTIuiSiLma0ksVJRlVkyxRF1yM1UosihZGa1F0WRWJKMWKsiyKFkzFaZIssY0y5x5v8V14f9RKJRUk/Nr9JYkhEmaAAIAAAAAAAAAAAAAAAAAANAAAAAAhgkggAAIAAqgAAAAAAABDJIKIAAAAAAABAJZAAEkAAAAAARKJRUlF+lSSQgiCyBCJCpRJBJFSSQSSiUCCTI+OgA+uPjQAAAAAAAAAAAAAAACWiMLsANQ3YNIjhJBnpGu1/VeEYZYEvHGpyVQFxheBn4/xfk/Vcsni7onhRVxJrOLvCrKSBXDIHyWe0+OX0uCqbJ4jc5IzeOpATRJqWX0zZZ7QAConzIcUAS4y+1ls9KuJBcnGTF4/xucl+1E2iVLuHHsQ00Z/rFv8AnJdPxIKEqRqcn6xeP8WATQOksvpiyz2E8yAEQ49irWC5JzvHL6bnJZ7Y845FlLuHHsVawY/rB0/nNkIKJ4LKXc6Y8kvtzvHZ6SCSDbCWkyjj2LAzcZWscrFCVLBZpMq1g5XG4+Y6zLHP2snkFCyl3N48m/bGXHr0kEkHRzGslWsFiTGWErWOdjGWUs8w49ipz84V11M4uCqZc645TJyyxuKA1nmAas2yq1ghPBkKuPY45Ya8x2xz34qYvPmChZS7lxz+qzlh9xIAOrmOOeRQuGsnPLDfmOmOevFVTxz5FijWCU8Gcc9eK1lhvzFgSnkg7OI1kq1gsGsoxlhtvHPqqngut1ko1gJ4OeOVx8V0yxmU3FgE8g7y7cBrKKNYZcNZMZ4b9N4Z9VU8F+hjawyU8GMcuvit549vMWAB2cRrJQuRJZ5HPPDfmOmGevFIvoyShaL6MmGf1Vzw+4kkgHVyVksELYuVawcc8deY7YZb8VZPKBVPDL9NjeGW2M8eqBJZXiAbs34Zl1dqFovoJIqcPOFdvGcXAi8+YO8u/LjZrwllGsMsGsmM8dtYZaVi8FihaL6Mzhl9VrPH7iSSAdXJVrBBdrJR7HDPHVd8MtwABh0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUQALgjmSRsAAAAAAAAAAAhbEgCQQiSKAAAAABJBKCwAAUJIAFwVRYjQQiQFAAZaCy3KkpkIsEAGlgQuRJGgsVJFAsQFyI1EgAirRZYxlyVUkEgNJJRVEma1tZElSyDQSQERqLIEFgqQQiTNaiSSECNxZElUSiVVkSiEDKxYIgkjSy5EoqiURqLEoqSRYsiSECNLElUWMtRJJVFkRUklUSmRVkWKFkRqJJKkogv0JRVEmWliUVRPIy0siUVLASSiEDFVZFkVRKJWpV0T0KosmZqpTLooWiZqrEohAyq7JTKrkSjNaXJXMhcgZqrouY0XTMVqLIlFUWRirFkWRRFo9Tjzf4rrw/wC4uSiqJPzH6cWRPNEEolEgAyAAAAAAAAAAAAAAAAAALAABQAAAhkkMAACIAAAACqAAAAAAAKIZBLIAAAAAABBJAEogEgQAGAAAQJRALFWQILCgSVRKIqSSCeoVKJRCJRKJABkfHeLwI4vItwoYXY+r6z/Xx7eH4rxMcTJwuwwidcv07YfiMjJOETwjrl+r2x/FeJjiZbCHCh1y/Tth+K8XkTxDhQ4UNZm8Di8BxDh8Rw+I/s/g4kTlFeFjhfYdsvw64X7Wyu5JjwwPkv3D459VcFMvuTxMvyRPjqwI4vAcSNTOM3DJICaJNSys2WIAAAMAA4ohxJBm4StTOxTALjCZi8f43OT9VUmSpIcPYhpom8sV1jkunkgoSpM1OT9ZvH+LAKSJNzKX0xZZ7QACoNIq4ssDNwlamdihKbRdorw9jncLPMdJnL7FLuWMbCeBOSz2l45fS4IUu5Y6zKX052We0AAqIcexUuS9znlxy+nTHks9qJ4LKS8iHHsVMbuDesc1wVTwWTydcc5XLLGwJIBplDj2Klw1k55ce/TpjyWe1U2iyafIq1ggxMrj4rdxmXmLghS7ljtMpfTjZZ7QGsgFs37JdelGsBPBkxko445cjjlhcfMdcc5l4qyeQULKXc1jnvxWcsNeYkAHRzQ49ipcNZOeWG/MdMc9eKqnjyLmNrBKeDOOevFayw35iwJTyiDt7cRrKKtYLEtbGMsNt45dVE8Fk8oq1ghPBzxyuN1XTLGZTcXATyDvLtws0nmijWCxLM5Y7axy6saeC6eSrWCE8HLHK43VdcsZlNxcBPPIHeXbgNZRRrBcNZ8zGeG/Mbwz14qqePIuY2TF48jGGWvFbzw35iwJIOziiS6oqXIkuqOWeH3HXDP6qYvPmChdPK8S4Zb8VM8deYEtZRAOl8uarWGIvHkWayUOGUuN8O+Nmc1WQgiL6EnbG7jjlj1ugrJYLEkyx7RccutY08F08lWsMJ4OWOXW6rrlj2m4sCSDu4IkupUuVksHLPHXmOvHl9VaLyCieGZOaNYZbjOeOqgSWUAas3NMy6u1ATJYIPPZq6emXc2AAigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRYoW6EWJAAaAAAAAAAAAABC2LEBAiQARQAAAABICAaAABJYoWRFiQAFQuZIBmtQABFWJKosGhbMsVJjyCxJK5kAirEIkEEghciSNhaL6FQFZAR0JMrEFiAhWosiUVJ8SNRYABpJKKokjSSxARFiSSCUZrcSSipKCrElUWRlpIAIsSiyKkojUWRJVEmVWRJVFkRuJRKKkoixZEkEojSSSEERViUVTJMquER0CIqxYqiURYsiSvUlGa1FlyJRUkirIkglEqpRJVFkZWLIsiiLGa0ugiESZF0SVTLGa0lFiqJRlV4skoi6exmqlF0URZGK1F0SVRKMWKsiyKosjjzf4rtxf7i5JVEo/Mr9JZEoqWJVWBCJM0AAQAAAAAAAAAAAAAAAAAAaAAAAABDAYIgAAAAKoAAAAAAAAQySGUQAAAAAAACCUQAAJIAAMAAAESSiqJNe1WBARkWHQhEhUlipKIqSSESZo+PAA+tvjQAAAAAAAAAAAAAAAASQAGEOFAE6yrMrEcJHCywM/HGpyVTALktIzeP8anJ+qJsniJ4URwk1nF3hU8SJ5lMNdCB8lntPjl9Lgrlk8XdG5ySs3jsSBlA3LtjWvYAADSZDj2JBm4StTKxTGAZCHFeRzvHZ6bnJPtVS7lsplXFogd8sfa9McvS4KptFk0/A3M5WLhYAkg2wcyHHsSCXGX2sys9KNYCeDIVcexyuFnmOs5JfFFLuWMZKeBOSz2l45fMWATTB1ll9OdlnsDWQC2bSXXpVrBBchxOWXH+OuPJ+il3LfIxvYlPBMc7PFXLCXzFgE0wdpd+nKyz2EOPYkEuMvsls9KEp4LNZKtYONxuPmO0ymXirJ9gUWxdSz5nTHPftzyw15gADbCHHsVLhrPmc8sPuOmOevFVTxzLmN7Ep4M4568VrLDfmLAlPJB29uI1lFWsFiXyMZYbaxz6qJ4LJ5KtY8iDnMrjdV1yxmU3FwE8+YO8u/TjZr2cyrWCxJnLHsuOVxY1sXTyVkseRC2OUtwrrZM5uLgReQd5duFmkso1gsS9zOWO2scuqieC6aaKNYCeGcscut1XTLHtNxYEp9iDu4jWShcSWTnnhvzHTDPXiqxfcsULRfRkwz+queH3EkkA6uSsljyITwXKtYOOeOvMdsMtzVWTyCqeC50wy3HPPHqgSWQC2bmkl1dqF4vJEkVOM3hXe6zi4CeUDvLt57NDWShcSWTnnjvzHTDLXioi+hJQvF58xx5fVXkx+4EvkQDo5KNYLReCZLJQ4WdK9E1nFwIvKB2l3NuFmrpLMbWC4ksmc8dzbWGWrpQAHB6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlEAC4I5kkbAAAAAAAAAAAI6kgCQQuRJFAAAAAAkglBYAAKEogAXBCJI0BcwQRUgAjQWKkoixYJ4YAVYBbgjQWKlgC5kkEp7EagACKtFlii2LErSSFsSAqSUQgZb2siSpYKEkEkaiUMkFgqQQiTNaiQARuLIkqiyJVSSQgZqxJKIJI0siUVRJK1FiUQERYsSiECNLIlFUWMtRJJC5EkVJJVEpkVZMsULEaiUSiqLIgsiUVRKM1pYlFUyTLSyJRBIIklEBGKq5KKolErUq6LFEWRmqlF0ULIzVi3UlbEEoyqxZMouRKM1pclELckzVXTLIoiy5GLGosWjzfkVRMefwOHN/iuvD/uLosURZH5tj9NYlFUSjCxZFipJKJABkAAAAAAAAAAAAAAAAAAWAACgAABDJIYAAEQAAAAFUAAAAAAAUQQSyAAAAAAAyCSACADAkgBgAAECSAixVkOpBIokkqiURUkkEhUkkDJLB8dyxuXB9V+P/wBfH/k/8U3GC4Hxf+nyf+KAuCfF/wCnyf8AigyXJHx/+nyf+KZfcZZbbwGEOl/Tvj+K5Y4i2ERwodc/07YfhxeA4kOHxI4WP7h/FW4kMruVwyMDvlPcOmN9VkIKE5fcs5E+JYEcTHEWckS4ZJATRJuWVmyxAACBOF2IAs2I4SHFlgYvHK3M7FBkyEOK6GLx2empyS+0KXclNMq4sgd8sfa9McvS4KptEqXc3OSVi8diQTnJBtgDSYAs2ekOPYqXJZzvHPp0nJZ7UTwSpdw49ir2Mbyxb1jmyEFU2uRZS7nSckvtzvHZ6ASQbYH4kOPYkGbjK1Mrj6UJTwWazzKtYOVxuPmOkymXirJpgoWUu5vHk/WcuPXpIJIOjmllGiwM5YytY5XFQspdyXHJRrBy1cHWWZxk+RBVPBZNM6Y5yuWWFxCSAbZQ49ipcNZOWXH9x1w5PqoUu5Yxkp48iY568VcsN+YsAmDs4jWSrWCxPMxlhtrHPqongsnkrJY8iDnMrjdV1uMym4uAnkHeXfpxs14qSklgsSZyx7LjlcWMvF58yJRxy5FTlLcK62TOLgReQd5d+Y42a8VJSSwWJM5Y7XHLqxrYunkrJY8iFscpbjXWyZzcXATyDvLtws0NZKtYZYNZMZ47bwy6qp4LFHsSnjyMYZa8VvPHfmLAkg7OKJLqipciS7HLPH7jrhl9VMXnzBQunkuGW/FTPHXmAayAdLNuajWCYvHkWayihwsuFd5ZnFwRF9CTtjdzbjZq6SUawWD3JljuLjl1qqeGXRjawTF4OeGWrqumeO/MWAB2cVZLBCeDJzRjawcc8dXcdsMtzVZFuiCsXhljpjl2jnlj1oVkixIyx3DHLrWNPBkzko1hiLwznhl1uq6ZztNxYAHZxVksEGTmY3szhnjq7d+PLc0AAw6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRYoi5FgAA0AAAAAAAAAACCxAQEgAigAABAASAgGgAASixQsiLEgAKIAGa1AAEVYkqiwaI7MsVLLdBYEogEVYLmCCKsEFuCNBaL2KkrZhVwQSZagtiSCUK1KlEoqT1I1FgAFSSiECNJLEBEWJJIJM1uBZFSUFWJIJRlpKJIRJFEWRUlErUWRJUsZVKJIRKI3EonoVLIixKJIJRGkkkBEVYlEAyq4RARFWRJCJRFiyJKolMzWosuRKKosRUokgkzVSiyKIsiLFkWRVEozWlyUVRJkXRJVPqWM1qJRYqSuRmqumSVRYzWkouihZGKq6LLr5FEWjzOHP/iu3D/uLolMqiT81+kuSVRKMVViUVRZEqrAgkzQABAAAAAAAAAAAAAAAAAABoAAAAAEMBgiAAAAAqgAAAAAAABBJDKIAAAAAAwAIJRAAEhkAAGAAACJJRUlGlT1JICMiw6EIlBUlipJFfIARlE5R9Y7T9fG+t/ADKIyu/wCQ7T9Ot/EgZXcjK7jtP0638SBlDK7jtDVAMkl2iAAAAAAAASQ4oAlxlWWxHCRwssDN441M7FMMFxjwM3j/ABqcn6qmyeLuhwkcLJrOLvDJbKJMbQLOS/aXjn0uCvEyykjczlZuFgCehBpgJxkgAQ49iGmiwMXjlbnJYoSpMs0mVcWY65Y+m+2OXtZNMFCU2izk/UvH+LAKSJOksvpzss9oHMAqIcexVlyTnlxy+nSclntjTwXUk+ZDj2KmN5YN6xzXBVPBZNM645yueWFgADTA45KNYLgxlhL6bxzs9qJ4Lp5IcexU5y3B0smcXBVS7l/I645SuWWNxQS9yAa1tlVrBBchx7HLLD7jrjyfVFLuSUJTwMeT6plx/cWAQOrkNZKtYLE42MZYbbxz6qJ4LJ5KtYIOcyuN1XS4zObi4CefMHeWX042a9pKyjjlyJBnLGUxyuKhaLzz5hrqipy84V2us4uCIv5knaWX042WeKESXVEgZYymOVxULxeSJLsVOMtwrtZM4uBF5B3l35jjZrxUlJLBYnmZyx7Ljl1Y08F08lWsMJ4OWOVxuq65YzKbiwJW6IO7gNZRQuJLPmc88N+Y6YZa8VWLLFC0X0ZMMvqrnj9xJPQgHVyVksPwITwZOhRrDOOePW7jthl2mqutyCsXhlzpjluOeWPWoIkupILlNzSS6u1C6eSsljyCeGcZbjfLtZM4sBnKB3cCSyULkSXU5cmP3HXjy14qYvKBRF1ujWGW/CZ468gksgG7N+GJdeVC0XlCSKo4TeFdrrOLgLdA7zy4EllFC5WS6nLkx+3Xjy14q0WCieC5rDLc0znjqhEkSDVm5pmXV2oCZLDIPPZp6pdzYACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEogIC4AI2AAAAAAAAAAAQSAJBCJIoAAAAAIkglBYAAKEogAXBC5EkaAgQRUgAy0FuZUsgsSIggKuAnlAjSUSVLAFsySpZEagASiNRMSxRbMuZqhC5kgqpJRCBlvayJKlgoSQSiNRKC5kFiKkIhEkrcSSiCSNRKJKosSqknoQiTNWJCIJI0siUVRJK0sWRUIixYkhAy0uEQiSNRJPJkIkipJKolEVZFihYjUSiUVLEElkVRJmtLEogJ7mWlkSiESCJJRARjSrolFUWRK1FkWKIsjNVZFkULIzVXJRUkyqxaJVciUZrS5KKkoxVXXMtF7soi0efwOPP8A4rtw/wC4uWKolH5lfprIsULIzVWJRCCMLFkWKolEokAGQAAAAAAAAAAAAAAAAABYAAKAAAEEkMAACIAAAACqAAAAAAAKKglkAAAAAABkEkASQCWAIAYAABAkgIsVZDqFzHQCUSQERVugIQIr5BgcLLA+rfHHx35KrwjhZYD44fJVeFjhZYD44vyVXDGGWBPjh8lUwwXBPi/9X5f/ABTJOWWx4DhQ6X6p8k+4rxMni8CeFEcI1nDeFOIniRXhYw+w7ZQ641byBQZYnJ+nx/i4K8TJ4jU5IzeOpA4kSbllZss9oAARJDSAFkpLZ6Rw9iGmiwMXjjpOSz2oTxMs0mQ49jHXLH012xy9ikn4FjG1jmBOSz2l45fS4IUu5KaZ0mcrFxsAAaZSyrj2JBLjKsysUJTwXxkq49jlcLPTrM5fYpdyxjJTwJyWey8cvpYEKRJ1ll9OVlnsDWQC2bRVxILhrJyy4/x1x5P1Cl3LLco1ggkzuPircJl5i4IUiTrLL6crLPYGsgFs37JbPSrWCE8FyHHBxyws8x1xzl8VKefMFCyl3NY8n1WcuP7iQSQdHMayUawXJe5jLDfpvHPSieCyeSrWCEc5lcbqulxmU3FwE8+YO8u/TjZr2kq12JBMsZTHK4qFovuJLqipx84V31M4uCIvuSdscpXCyz2ESXYkDLGUls9KFovuJLsVOPnCu/jOLgiL6Mk7Y5TKOFllCJLHIkDLHcMcutULxeSsl1XIg4y3Cu1kzi4CeQd5d+XGzQ9yrWCxLWUYzx21hl1UTwy5jexKeDGGWvFbzx7eYsCSDs4okupUuVksbnLPH7jrhl9VaLz5gotjInlGsMt+KznjrzEBrIBuzbEuvKhaL6MmSyUOHnCu81nFwIvIO0u5txs14S90Y2sMuJLPmZzx21hlqqxeH4FihaL6GePL6rXJj9xJJAOrkq1hiLwyzWUUOGU63w743tNVcERfQk7Y3c242auklGsMsJLKM547jWGXWqxeGWKFovKM8eX01yY/cSHvzAOrko9i0X0EkVOF/iu8/uLgJ5QO8u3CzQ1lFC5El1OfJj9unHl9KgA4u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyJKIuRqAACgAAAAAAAAAAhcyxARCJAAUAAAIACQAGgAASixQsiLEgAKIEEma1AlbEAirghEhoiyxQutwsCUQCKsFzBBFWA6AjQWXIqStmSquACNQXMkglchWpU9CUVJRGlgAFSSiESiNC5liCVyIsESQSZbiSUVJQaWJIJRlUkkInqZWCZYqSg1FkSQSZaWQIRKI1EosULIixKJIJI0nkySAjKrEoqiURYsiUQCKugQSRYsSVRYzWolEoqiyIqUSQSZqpLFUSiLF0SiqJRmtLkoqiUZF0SVRYzWosuZJUsZqrIkqmWM1pZMvHm/Ixpl4c35Hn5/wDFdeH/AHFySESj81+osiUyqZKMi5JVFkYVJKIRKJVWBHQkxQAAAAAAAAAAAAAAAAAAAAGgAAAAAQAwRAAAAAVQAAAAAAAAqWIZRAAAAAAGABBJAAEhkAAGAgAAJJRVEotVPUkAgkkqiQr5ECOIcXgfVfkxfHvjySCOIcQ+SHTJII4vAcXgXvidMkgjiHEh3idMvxICaCaL2idb+AGUC7QAAAAASRhdgBqVZbPSOHxI4WWBi8crUzsUwC4wn0M3j/Gpy/qvEyVLwDiQ0yf1iv8AGS2UChOWizk/UvH+LAhS7kppm5lKxcbAAGmUkOKAJZL7WWz0q0yC4wmc7x/jpOT9VTZbKfgVcexBneWPtrrjl6XBVNospdzpjnK53CwBJBthPMq49iQS4yrjlcfShKeCzWSrj2OVwuPmOszmXirJ5BQlSLjyfqZcf4sAnkHWXbkkq49iQS4y+1mVnpQlPBZrJVpo43G4+Y7TKZeKsnkFCyeeZ0xz37Yyw16SADbmOOeRQuGsnPLDfmN4568VVPBZPJVrBCeDGOVx8VvLGZeYuAnkHeXfmOVmvaSrWCQTLGZGOVxULRl3Eo9ipx84V28ZxcEJ9yTtjlK45Y2BEl2JAsl9ktnmKFovoyWslDjZcK7SzOLgqnjmXO2OW445Y3FBEl2JAs2S2XcULRfQSXVFTj5wrv4zi4IiyTtLubcLLLqp6FJLHkWJJlj2XHLqxrYunkq1gJ4ZyxyuN1XXLGZTcWBK3WxB33twGslC4ks+Zzzw35jphlrxURfQkoWi+hMMvqryYfcSSQDq5KtYCeCzRR7HDLHrdx3xy7TVZCCsXjYsdcctxyyx60IkupJLLlj2hjl1rGti6ZVrDEXhnHHLrdV0ynabiwJIO7iiS6lTIUawzjnjrzHbjy34qyeUCsXhlzphluOeePWoIkupJJcpuaTHLrdsZdboq1hiLwzjjet1XbOdpuLAA7uCJLfJVPBkZjawzjnNXcdsLuarJzIIi+hJ1xu45ZTV0FZLDLBrKJnjuLhlqqp4ZYoXi8rBjjy+m+TH7A1sAdXJRgtJFTz5TV09OF3NgAMtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWW6KkoKsACNAAAAAAAAAAABcwAJBCJIoAAAAAIkgkLAABQlEAC4IRJGgIEEqxIAMtJRYoWQWJJj2IAVYAEaSiSpYAn0JKluhGoIAEaXXIkotmXM1QJ7gFVJPQhciUZb2lElUWChJBKI1KlErmQiSKklELkCVuJJIBGosiSqLEqpJIRKM1qJJRD5girEkIkjSSyKkojUSSiEDKrEohEkbiwIJIJJKolEVZEogkjUSiyKFiC4ICM1qJLEBGWliUQiSUiSSCUZVYsiiLIlbiyLFUSjNFkWRRFkzNVYsipJlpYsipKZmrFi8Ob8ihaHP4Hn5/8V24f9xkJIRKPzH6aSyKolEqrIsiiLIxVWJIRKMrEosVRPQlEgAyAAAAAAAAAAAAAAAAAALAABQAAAgkhgAARAABQAFAAAAAAABRUEsgAAAAAAMgkgCSAAJIAAAAIEkBFirElUSwJJIBFfIuHzHD5kg+r9Y+O9sv1HChwrxJBOkO1/UcK7jhJA6YnfJHD4kcLLAnxxfkyV4WMPsWBPji/JVAXGxPj/wDV+T9iuWOJlsIjhQ65Q7Y33Di8CeJEcPiRhk3nDWFWygUGSzk/T4/yrgrxMlS8DU5IzeOpAyuhJuXbFmkAACcFXEkEuMvtZbPSriyC5PPoYvH+Nzk/VE2iVLuHHsQ00Y/rFr+cl85IKEqTNzk/Wbx/iwClkHSWX0xZZ7CXhkAIhx7FS5PPmc8uOfTpOSz2onglSDj2KmN5YN6xzZCCqbRZNPwOmOcrnlhYAA2wNJlWsFiTGWEreOdjGWUu4cexU5+cHT+c2Qgqngsnnkdcc5XLLC4hJANMocexUuGsnPLj/HTHk+qqnjmWRRrBKeDOOdnitZYS+YsAnkHaXbjZr2nBSUcFgZyxmTWOVxULKXRhx7FTl5wrr4zi4IUu5Y7Y5SuOWNxQGs8uYAs37JdelCYvHkWayUONlwrtLM4yEFYvBc645bcsseqBJZ8wDVm/aS68xQtF42fIlrJQ4WXCu0szi4Ii8cyTtjl2jjlj1oRJdUSBlNkurtQvF526kSXVFTjN4V2smcXATyDvLv042a8Ja7lGsFg1lbmM8drhl1VTwXMb2Ji8eRjDLXiumeO/MWAB2cUSXUqZCklg45468x1wy34qyeQVTwy65G8Mts546QJLPmAbs3NMy6u1C0XnYSXUqcPOFdvGcXAW6B3l24ehrKKFyJLqc+THfl048teKRfQkoXTyhx5fRyY68wDWUAdLNuc8KFovoJLqVOHnCu/jOLgJ5WwO8u3D0SWUULkSW+TnyY/brx5fSYvKwCieDJzLhluaZzx1doIktiQas3NMy6u1C6eUVksMReGccb1uq7ZTtNxYAHdwVkgnhl2smM45zV3HbC7mqyEERfQk643c25WauklGsMsRJbGc8dxrC6ulQAcHoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWW6JKrmWI1AABQAAAAAAAAAAESQSuRCAACgAAEogASAA0AACYlihYixIACiBCZJlqBK5kAirghEhpMSSpYLKEogkipC7AgixYAEaC6KExZKsXABGoIkglCtSpJRUsuZGokABYksVRKI0lEkEoixKBBJluJRKKkoNLEkEoyqSSET1MtQ65LFSUFiyJKljLSwIRKJWolFihZEWJRYr1JI0kkglGVSSiEERYsiUR4kkVZFihYixPQkqixmtRJJCJRFWQIJM1VkSiqJRFi6JRVFkZrSxKKrkSjKsiYKpljNVZEoqWM1YumTH2n5FEy8N5PyOHP/AIrtw/7jIiUUTLo/LsfqJJIRK7GaqxKKolEF0SVRZGFSWRVEolVYEEmAAAAAAAAAAAAAAAAAAAAAGgAAAAAQAwRAAAAAVQAAAAAAAEEFiGUQAAAAABgAQT0IAAAAAAEAAUT1JIRKCiJIJIPkYK5fcjL7n1T5Y+QfHVwVy+4y+4+WHx1YFcsZY+SHx1YFeJk8RfkifHUgji8BxIveJ0ySBlE5Re0SyxAAKgAAJIaXYAWSktnpHCRwssDF45W5nYoMmQhpGbx36anJL7V4mWUkQ49iuME3lj7XWOTJ5EFCVJmpyT7ZvHfpYBSXkSbll9MWWe0AAqDSZVxZYGbhK1M7FCU2izS6kOPY53Cz06TOZe0qSJMZKbRZyfqXj/FgFLPMk6Sy+nOyz2glpMgF9oq49iC4ayc8uP8AHTHk/VU8Fk88irWCDEyuPit3GZeYuCFLuW+R2mUvpxuNntAazzALZtFWsEFyHHscsuP7jrjyfVFLuWMZKeCY568Uy49+YsCU8kHaXbklopJYLEmcsZWscrixl08kOPYqcvOFdtTOLgiMu5Y7Y5SuGWNx9oDWfMAWb9ktnmKExeCzWSj2ONlxrtLM5qshBVPBfodcctuWWPVAayAas2zLr0o9iU8eRZrJRrBwsuN3HfGzOarIQVi8eRc645bcsseqBJZ8wC2b8JLrzFC0X0ZMlnkUOPnCu01nFwRF9GSdsbubcbNXSSklgsSTLHtFxy61jWxdPJVrATwzljbjdV1ykzm4sAtwd3AayvEoXIkupzzx35jphlrxSL6ElC8XnzGGX1Tkx+4BrYA6OajWCYvBZrKKHCzrfDvje81VwRF9CTtjdzbjZq6SUawyxLWUTPHcXDLrVE8MuYy0X0OeGWvFdM8dzcSSQDs4qyWGE8Ms1lFDhlOt3HfG9pqshBEX0JO2N3NuNmrpJRrDLBrKM547i4ZaqsXhliheLzsZ48vpvkx+wkgHVyUawy0X0EltkqcL/Fd5/eK4CeUDvLtws0NZRQuVkupy5Mft148vpaLygUTwzIawy3Gc8dVBEl1JJNZTc0zjdXbGtjIuRjezLRfQ5YXV068k3NxJJAOziq1hkF5LKKHnymq9OGW4AAy0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABboVJQWLAAjQAAAAAAAAAAAQAEgIEUAAAAASgQSFgAAoSiCSCwADQECOpKsSADLSVzLFCwWJJi+hAQVYAEaTnYkqWICJKliNQAAaXRJWLLGVAgQVViSCUZb2lEkLmSFCSCUGosEQgZVYlEAlbiSUQCNRZEkIklVJJBKM1qJJRHUIirEohciSNJLFSURqJJRCJMqsEQgRtYnqQSQSSVLIirIIqi3iRqJRZFSSCyJ6EdAjNaixJBKMtLEoqiSLElkVJRkWRZFEWRK3F0SVRPQxRZF0Y0XRKqxKKkmWlkXh7T8ihan7XwOHP8A4rrw/wC4vyZdFWEz8yv1V0SQiUYFupKKolGVXRKKosZsVJJCJRlYsiSqJM0SACAAAAAAAAAAAAAAAAAADUAAAAAAIJIYAAEQAAUABQAAAAACCQUVBLIAAAAAADIJIAnoQAAAAAABAkglFipQCAHyQbeAB9X0+OGPBDHggBqG6YXYYXYAnWLunCiOHzJBOkXtf1HD4kcLLAnxxfkyVwyC4J8cWcihOWWwhwoz0ynpe+N9xVSJUkOEjDG84usKtlAoMlnJ+p8f4uCvEyeI1M5WbhYkDKYNy7YAAAaTIcSQZuErUzsUxgJ4MhDijneOz06Tkl9oUic5KtMgTPKey4Y5elwVTZZSTOkzlc7hYAA0yl4KuPYkEuMrUys9KEp4LtIq49jlcLPMdJnMvFSpJgoSnguPJ+plx/iwCfYHWXblZr2EOJIJZL7WWz0o1glPBd7lHHByuFx8x1mcy8VZNMFCyl3NY8n6zlx/iQSQdHMayVawWJMZYStY53FjTwXTz5kOOORU5y3Cutkzi4IUu5J2mUvpxuNnsDWeQAsl9ktnpQlPHkWayUawcbLhXaWZzS4Kp4Lp5OuOfZyyx6oDWQDVm2fSjWGSngs1lFWsHDLG43cd8cplNVfoQVTwXW6OuOXZyyx6oDWQDVm2ZdKPYmLwWayUZwsuFd5ZnNVkIKxeC51xy7OWWPVBEl1JBbNzSS6u1C0WJLqipx84V3us4uBF5B3l35cLNeEtdyjWCwayYzx21hl1VTwXMZaL6GMMteK3njvzEgA7OKsljchbGQo1g45468x2wy3NVZPIKp4LnTDLcc8setQRJdSQXKbmkl1dqF08rxKyWGE8M443rfLtlO83FgAd3BEl1KlyslhnLkx+468eX1VovKBVPDLmsMtxnPHrUESXUkk1lNzTMurtjLp5RWSwxF4ZxxvW6rtlO03FgAd3BElvkqngyczG9jjnNXcdsMtzVZOZBEX0JOuN3NuWU1dBVrBYNZRnPHcawy1VYvDLFC8XlGePL6a5MfsDWQDrZtyULRe2BJdSq2Zwn8ZO9/vFcEkHdwRJdSpkMbWGceSau3bjy3NL5ygRF9CTrjdxzymroKtYZYSW3kZzx3Fwy1VAAcHoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWJKosRqAACgAAAAAAAAAAIkglEAABQAACUQAJAAaAABKLFSxGoAAAAgZrUCUQCKuCFuSGkxJKosFgSiCVzIqREEEWLE9CARqBdFC0WSqsACNQiSVLCtSpLIqiURpIACxJYqiURpKJKliLEoEEmW4lEoglBpKJIJRlU9iSESZaSiSqLIlWJROSESRpZMEIlEaSixUkjUSiyKFiKlEkEmVSSiESiLEkoAirIkqW6EWJJIRJmtRJYqiURUokhEmaqyJRVEoixdFkyiLIzWliUV6EpmVZCSqJMLFkXp+0/IxovT9p+Rx5/8AFduH/cZRyYQZ+Y/ViyJRVFjFFgQiTNVZFkURZEosiSCTCpLIqiUZqrAjmiTIAAAAAAAAAAAAAAAAAAQAAaAAAAABADBEAAAABVAAAAAAAFEEFiGBAAAAAAGABBJBKAgAAAAEAAUSSiAFfJcruMlcMYZ9S75fj5B0x/Vs+QK4fYYfYd7+L8c/VyCgHyf+Hx/+rgrl9xxPuX5Ynx1YFeJk8RfkifHkkEcSJyjUylZuNn0AeQKgAAJIwgBZL7JbPSOHsRhlgYvHK3OSqE5ZbnzDiuhjpZ6b+SX2hSJzkq4sgd8p7OmN9Lgqm0SpG5ySsXCxIJzkg2wBrIAs2b0hx7FS5LS6nO8f46Tkv2om0SpBx7FTG8sW9Y5rgqm0WTTOmOcrncLAAG2BrJVxwWBnLCVrHKxQspdyXFMq1g5auDrLjmvzIKJ4LpnTHOX255YWegAG2BxyUawXJayYywl9N452e1E2iyeSrWCDnMrj4rpcZl5i4IUu5J2ll9ONlnsIcexIFkvsls9KEqWPIs1ko1g42XCu0szmmQgqngvnKOuOe3LLG4oJayiAas2z6VawE8F8bFGsHDLG4+Y7Y5TLxVk8gonjkXTydMM9sZYdQlrJAN2bYVawE8F2soxtYOGWNxu47Y5TKarJzRBVPBdPsdcctueWPVAaz5gGrN+El15ULReNmTJZ8yhwsuFdpZnFwRF9GSdsbubcbNXQVkseRYkmWO4uOXWsa2Lp5KtYCeDljl1uq65SZTcWBPQg7uBJZKFyJLqjlnj9x148vqkXkkoXTyXDLfipnjrzANZQB0s25zwoWi+jElncqcPOFd/GcXATyDvLubcbNeBrJRlxJZRjPHflrDLV0iL6ElC8XlE48vpeTH7gHugDpZtzULRfQSXUqcPOFd/GcXATygd5duFmhrKKFyJLfJz5Mft048voi8okonhl0Xjy3NJnjq7CJLqSSaym5pmXV2xl08oq1hiL3OOF63Vdc52m4sADu4qyW4Twyz3RQ4Zzrdx3wvaarIQRF7EnbG7m3GzV0l7oxsuRJdTHJj423x3V0RfQkoti/MvHdzRyY6uwiS6kkmspuaYl1dsZkT2Mb2ZaL6HLC6unXObm0kkA7OKrWGQXktih58pqvThdwABloAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3MqSgsWABGgAAAAAAAAAAAgQtgLAAigAAAACUCCQsAAFCUQSSiwADQAQiVYkAGWkplihZBYkmL2IC2YVYAEaSSQuZJAXIkqmWI1AABpckrFljKgQIK1FixUlGWosgQiQ0IkgkjUWCIQILEogErcSSQCNLIsiqJM1UkkEkrUSSipKIqyJIRKI0ksipKI1EkoglGVWCIRKI2sgiCSUSmSQSRVkCEWI0IsipKMixKIJRK1E8iSAmZaXJRVEolWJLIqSjIsiyKFkStxdMkqiyMCyLIxoujNWJMlP2vgYzJT9v4HDn/wAV24f9xkRJHUlH5j9ULIoyyJVWRZFSTAt1JKrkSjKrolFUWM2KksVJRlVkSVRYyAAIAAAAAAAAAAAAAAAAAANQAAAAAEMEkMAACIAAqgAAAAAAABBIKKglkAAAAAAEAkgCSCUQAYAAAAIEkEmor5KAD6s+OAAAAABhdhhAE6xd1HChw+JIJ0i96rwsjDLgzeONTkqhOX3L/IhxRPjs9L8kvtXiJUkHHxIaZN5xdYVbK6MFBks5P1Lx/i4I4ieJG5nKxcLAEkGmQYzzAAhx7ENNFgYvHK3OSxQlSLNJlXFmOuWPpvtjl7WTTBQlNos5P1Lx/iwClnwB0ll9OdlnsJaRALraIcexUuGkznlx/jpjyfqqeCyaZVxZBiZXHxW7jjl6XBCl3LLc645SuWWNxQSQDTKHHsVLhrJzy4/x1x5P1VSwX58ijWCE8Gcc7j4q5YTLzFwE8g7S79OVmvaSrj2JBLjL7JbPShKZZrPmUexxsuFdpZnGQgqngunk645bcssbigNZQBqzbPpVrBCeC5VrHkccsevmO2OfbxVk8goti6eTeGe/FYzw15gT5kA2wq1ghbFyrWDjljrzHbHLfirJ5BRbF08o3hnvxWM8NeYBrIBuzbCjWGSnhlmslHscMsbjdx3xymU1WQgrF48i51xy7OWWPWoIkupILZuaSXV2oXi8kSXVFTjN4V2us4uAnkHeXflxs14HuijWC4ayYzx35awy14Vi8eRYoWi+hnDL6rWeP3EkkA6uSrWAnhlmij2OGWPW7jvjl2mqyEFYssdsctxyyx63QVksFiXuiZY7hjl1rGnhmTmtjG1gmL3OeGWrqumeO5uLAA7OKslgJ4ZdrJjZxznW7jthe01WQgiL6EnXG7m3LKauklGsMsGsomeO4uGWqrF4ZYoXi9jHHl9N8mP2EsgHVyUexaL6CS6lTh/jJ3n94rgLdA7y7cCSyULlZLDOXJj9uvHl9LJ5QKxeGWN4ZbjOeOqESW5JLWUMpuJjdVRPDLmMtF7HPjv06ck3NpAB2cVHsWi9sCS6lVszh/nJ3/3iuCSDu4IkupUyMxs48k1du3HdzS/kCIPoSdcbubcspq6TzMb2ZciS6mOSeNt8d1dKgA4u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3QkqixGoAAKAAAAAAAAAAAiSvUsQgAAoAABKIAIkABoAAFkSVRYjUAAAAQMtQJRAIq4IJDSY8iSqeGWDUCxUEFguQIT3IsWABGoF+hQtFkqrAAjQiSq5liVqJ8SxVEoNJCACxJYqSiNJRJVFiNRKBBJlqJRKKlkK0sgQSZVJJCBlpZEoqiyIsSSiESRpZAhEkaSixVEojUWRKKokipRKZBJlUlipKZFiUWRAIqyJ6lUWRFiUySESYaiSxVPJKCrIIhEmaqyJRVFiLFiyKIsjFaWLJlQjKshen7XwMaL0/afkcOf/FduD/cZlugiEyT8yv1UhcwgRYsiUVRYxRZbAgnoZqrFkURZGaLIlEEmVWJKolGaqwAMgAAAAAAAAAAAAAAAAACwAAUAAAIZIAgBgiAAAAAqgAAAAAACiGQWIAgAAAAAIJDAgkglAQGAAAAQAAHyXiHEhw+I4T6n/b5F/BxLxJ4kV4RwsbzOuH6tldxldyvCxh9h3y/Dpj9VcgoB8n/h8f8A6uCuWOJmpyRPjqwI4gpIszlZ6X8SCeZBpkAAAYQBLJfay2ekOJVrBckxeOfTc5L9sZKkyzSZDiZ65Y+mu2OXtKkiTGE8FnJftLxz6XBCl3JTTNzKVi42AANMjWSHHsSDNwlamVihKbRdrJVx7HO4WeY6TOZeKlNMFCU2i48n6l4/xYBNMHWXfpzss9gayALN+yWz0q1ggyFXHsccsLPMdceSXxRS7klCU8Fx5Pqplx/cWATyDrLtySVcexIM5YytY5XFQspdw4lTl5wrr4zjIQVTx5F08nXHKZOWWNxQGsgGrNs+lWsEJ4MnMpJY8jjljcfMdsc5l4qyeQULp5NYZ78VjLDXmBJAOjCslggyFGscjjnhrzHbDPfirJ5BQvF5NYZ78VnPDXmAAOjmq1ghPBk6FGsHHLHr5jthl28VZPKBRPDMi3N4ZbYzx6oDWUAbs2xLpQtF/IlrPIocLLhXeWZxcERfRknbG7m3GzV0kpJYLE9CZY7i45daxp4ZkW62KNYCeDljl1uq65Y9puLAkg7uCJIqXKyWH4HLPH7jrx5fVWTyCieGZDWGW4znjqoElkA1ZvwzLq7ULxeSslghPBxluNdrrOLgnOSDu4ElsULlZLBy5Mft148vqrReUCqeGXRrDLcZzx1UESXUkk1lNzTMurtjLp5RVrAi8M443rdV2ynabiwAO7giS6lU8MyNbGNnHOau47YXc1WQgiL6EnXG7m3LKauklGsMsJLKM547jWGWqrF74LFC6eUTjy+muSfYGsoA6Wbcp48qF4vKKyW4i8M4S9cneztj4WAB3cESXUhPDLPdFDjnNXbthdzTIQIvYHXG7m3KzV0l7mMuRJdTHJPG2+O6uiL2JKp4ZcvHdzSck1UET7khrY1lNzTON1dqLZmQxl4vY5cd+nTknjYS90QDs5KAtJblTzWaunqxu5sABFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtzKkoLFgARoAAAAAAAAAAALkCALAAigAAAACUCCQsAAFCyKkolWLAAKgkBEqwABlpKLFCwWJLLcqI7MLFgARpYEIkglPYELYkjQStiEA0uSViyxlQlEELYrUWJIJRlqLAhEhpIIJI1FgiEMkIsSiAStxJKIBGl0SiqJM1UkkEkrUSSipKIqxYqiURpKLIqSiNRJKIJMtLErkV6EojSwRBJBPUkgkirBEIsRpKJRVEoyLIlMqWRK1ElipK5GWliSqJRKsSiyKkoyLIsipKJW4uiSqLGBZF6ftPyMaL0/a+Bx5/wDFduD/AHGZFluihZM/Lr9VJLIJRlRcyyKkpmaq6JXMqSZErYsipZGVWRKKosZqpRYqSZVYkqixmgACAAAAAAAAAAAAAAAAAADUAAAAABDBJDAAAiAACgAKAAAAAAQyQUVBJAAAAAABAJZABglEAGCSAAACPkwAPrD46AAAAAAwgBoMIjhXckGekamVn2jhZGH2LAl441OSqE5ZfzI4UZ+Oz0vyS+1eJk8Q4fEjDJvKLrCrcwUJyyzk/UvH+LAhS7kprodJlKxcbPYACspIcQCWS+1ls9KtMguGkzneP8dJyfqqkyyeSHHsVM9ssfa9ccvS4KptFk8+B0mcrFwsAAbYGslXHsWBm4StY5WKEqTLNZKtNHKy4+Y6zKZ+1k8goWUu5vHk37Yy49ekgkg6OY1kq1gsSYywlaxzuLGXUskSj2KnPdwrrqZxcEKWC2TtjlMnLLG4oDWQC2bZl0q1gJ4L9CjWDjljcfMdsc5l4qyeQULp5N4578VjLDXmBJANsIkscipciUexxyw15jrhnvxRPO3UkoWi88zWGf1Uzw15iSSAdHNWSwQZCklg454a8x2wz34qyeQULp58zWGe/FZzw15gTzW5AOjmq1gJ4LNZKNYZwyx63cd8cu01WToQVi8eRc645bcssetQRJdUSC2bmkl1dqF4vJElgqcZbhXayZxcBbg7y7cPQ1koXIkjnnjvy6YZa8UiySheLyiceX1V5MdeYDGQDq5KNYJi8eRaSyUOFlwrvLM4uBF5B2l3NuNmrpPNGNrDLiSyjOeO41hlqqxeCxQvF7GePL6a5MfsJxlEA6uSj2LRfQmS2yUOF/iu8/vFcBPIO8u3CzQ1koXKyW5z5Mft048vpaLygVTwy5cMtzSZ46qCJIkk1lNzTMurtjMi3RRrDEWcsLq6rrnO02sADs4qyWGIvctJZRQ4ZTrXfH+8fK4EXlA7y78uFmvA1koXKyW5z5J9uvHfpaL28gVi8MsXC7jOc1QrJblg1lFzm4mN1VU8MsULx3Rjjv03yT7A1sAdb5clC8XsVktxF4Zwx/nJ3y/rHawAO7grJbiPMtJZRQ4ZTrdu+H9Y6XAW6B3l24XwPkULlWsM5ck+3Xiv0gAHJ2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAC4KosRoAAUAAAAAAAAAABciSpYhAABQAACUQECJAAaAABZElUWI1AgkAAEDLQSiARVwRzJDSy3QKxLBqBYqSiAWW5AWzIsSACNRK2ZYoWiSqsACNJQKrmWJWonqWKolBpJKIAWJLFSURpKJKrmWJWokEIky1EosiqJQrSyJRUkyqwIJMtJXYkqiyJVixKKokjSyAQJWlkSVRYjUSiSqJIqUT1I5MkyqSxUlEWJRYgIirEoqiSKsiSESYaixJVEoKsEQiTNVZFkURYjUWRZFEWRiqsZKT9Z+RjL0vafkcOf/FdeD/cZkSipKPzH6y/QIiJJmqlhPcIgixdFkUTLGKLIlFSTNVYsipKM0WRKIJMrFkSVRKM1VgAZAAAAAAAAAAAAAAAAAAFgAAoAAAQyQBAAIgAAAAKoAAAAAAAohkFiAIAAAAACCQwIJZBIEBgkCAAEfJMscTLYXb8xwo+p9cv18i7YfivEyeIcKHD4jWZvA4u5PEiOEjhY3nDWFWTRPPsUwyB8lnuHxy+quCmWTxMvyRLx1YEcXgTxI1M5WbhYAA0yAABhdSHFdCQS4y+1mVnpVpoguS1noc7x/jpOT9UTaJUu4cexDTRP6xX+clsgoSpGpyT7ZvHfpYBNMHSXbnZr2BrPMAWbEOPYqXDWTnlx/jpOT9VTaLJ5KuPYgxMssfFbuOOXpcFU8Fk88jrjnK5ZY2BJANMocexUuGjnlx79OmPJr2qngsnkq1ggxMrj4rdxmXmLghS7knaZS+nGyz2BrPmAWzfsl16UawSngvjOzKNYOGWNx8x2xymXirJ5BRbF08+Z0xz34rnlhrzAkgG2ENY5FS5El2OWeH3HXDP6pF9yShaMujGGf1TPD7iQAdXJDXYqXIkuqOWeH3HXDP6pF9yShaLzzLhn9VM8NeYknoQDo5qyWCFsZCjWPI45468x2wy34qyeUCi2Lp5N4Z7Yzx0BrIBuzbEulCYvoWks+ZQ4WXCu8szi4Ii+hJ2l3NuNmrpJRrBYNZJnjuLjl1qqeGXRjawTF9DnhlrxXTPHfmLAA7OKsljchbGQxtYZxzx1dx2wy3NVkTyQVi8FjpjluOeWPWhEl1JJZcse0Mbq7Y84MieTG1hkxeDlhet1XTOdpuLAA7OKskE8MtzKNYOOc1dx2wu5qsiIIi+hJ1xu5tyymroKtYZYNZRM8dxcMtVWLwyxQvF5Rjjy+m+TH7CWtiAdXJRlovoJLqVWxw/xk7/7xXBK5EHdwRJbFTIUawzjyT7dePL6WW6BWL3wWOmF3GMpqhWSwywkthnNwwuqrF4ZYoXTyjHHfpvkx+wNZQB1s25Tx5ULxexWSwxF7nDG9ctO+X9Y7WAB3cFZLcReGWluihwynXLbvh/WOlwFugd5duF8DWUULlZLDOXJPt14r9LR3QIi+hJvC7jGU1Qq1hliJInJNxeO6pFklDITjvjS8k1doIktskks3lNzTGN1dsYAPM9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAi5QsgsSACNAAAAAAAAAAABAhcwLAAigAAAACUCESGoAAAWRUlEqxYABUEgIlWAAMtJRYqtiwWILp5RURYWLAAjSxBCLEEoELmSRpKC2ZADTICq5FjKhK5EBcxWokkgnoRqLAhEhpKBBJFWC5EILmRYsSQEStxYIgkjSxKKokzVWBBJK1EkogIixYsVRKI0siUVLIjUCyKkoy1FiUQERpYIgnkyCUSQSRVgiESiNLIlFUSjIsSmVLGa1ErZlkVJRGliSqJRKsSiyKlkZFkSipZErayL0vafkY0ZKftPyPPz/4rrwf/kjKiyKkn5j9ZZFvEoWRmiUSQSjKi5lkU5FkzNVdEoqSZFkSVLIyqyLIoixmqlFkVJRlVkSVRYzQABAAAAAAAAAAAAAAAAAABoAAAAAEMEkAAARAAFUAAAAAAAAIZIKKgAAAAAAAgEsgCSCSADBJAHyYAH1h8cAAAAAAkgAMIjhRIJcZVmViHHxIaZYGbxxuclUJyyzDijHx2emvkl9o4icojhZXGB2yns645emQgoSpM1OSfbN47PSwCaJ6m5ZfTFlntAAKg0mVcWWBm4StTOxQlNos1khx7HO43H06TPHLxUqSYKEptFx5P1Lx/iwCaYOssvpzss9gaTAFm/aS69KtNEFyHE5Zcf3HXHk/RS7lvkY2iU8Exzs8VcsJfMWATTB2l36crNewhx7Eglxl9ktnpQlPBZrJVrBxuNx8x2mUy8VdbkFE8F08nTHPbnlhr0EkA2whrHIqXIlHscssPuOuOf1SMu5JQsn3GGf1TPD7iQAdXIkuxQuJLPI554fcdMM9eKiL7klC0X0ZMM/qrnh9xIAOrkiS6oqXIkupyzw+464Z/VTF55goXTyXDPfipnhrzAkgHRzVawwngs1ko1g4ZY9buO+OXaarJzRBVPHkXOuOXaOWWPWoIkupILlNxMbq7ULxeUVksEJ4ZxluN8u1kzi4CB3cCSyvEoXIkupz5MfuOvHl9VMWChdPKGGW/CZ468wEllAHSzbEurtQtF9BJdSpw84V2us4uAtwd5duBJZXiULlZI5cmP268eWvFWi8gonhmRGsMtxnPHVQRJbZJJNZTc0zLq7Yy6eSrWGIvDOON63Vdsp2m4sADu4KyXUJ4ZZrJQ4Zzrdx2wvaarIQRF9CTtjdzblZq6CjWGXIkupnkx3Ntcd1dEX0JKGRPYnHl9LyTV2gSWUAbs3NMS6u1C6eSrWGTF7nLC6uq65ztNpAB2cVZLDEXuWksoocMp1yd8f6xXATygd5duBJZRQuVawzlyT7deO/Sy3QIgyTeF3GMpqhVrDLESWxOSbi4XVIvoSURfoTjvjS8k1dhEuRJJvKbmmJdXbGjJ4mNlo8sHLjurp15JubSOaAOzioWi9iJLcReGcMf5yd7/WKwAO7grJbkF5LYoefOar0cd3AAGWwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAuCFuiSNAACgAAAAAAAAAAIkhPckgAAKAAASQEFiQAFAABZElUWI1AgkAAEDLQWRUlEVYgkBpZbgiPYkNQLFSehALc9yAn0IsSACNRK2Zcxl1yJVSAA0lcgQnuSZrUSixXoSg0klEAjUWRJUlBVlyBC5kkrUSCESZaiUWKkolaWRKKkkVbqCCTLSUWKkkWLEoqSRqLIBAjSyJKoky1FgQiwURKIJMqlFipKIsSWRVEoirEohFiKkIgdDDcXRJUkCxKKokzVWRZFCyI1KsjJS9p+RjRkpe0/I8/P8A4rtw/wD5IyolEEn5b9ZZEoqSQXCIRKMqlhAcjKxZFkVRJkWRKZUkysWRZFUSjNF0SipJhYsiehUlEqrAAyAAAAAAAAAAAAAAAAAALAABQAAAhkgCAARAAAAAVQAAAAAABRDILFQAAAAAAQSGBBLIJAgAkD5EMvuAfTnybScscTIBd06xPF5E8XgVBe9Z+OL8SGV4FAa+SpeKMhBQniZqck+2Lx36WBHETxI1M5WbhYAnyINMhJAAYRDiSDNwlamdigzgyEOKOd47PTpOSX2hSJTyVaZAmdnsuGOXpcFVJosmmdJnK53CwABpkayVcexYGbhK1MrFCU8FmkyrWDlcbj5jrMpl4qyeeQKFlLubx5P1jLj/ABIJ5kHRzHuVccFgZyxlaxyuKhZS7kuOSj2OWrhXXczjIQVTwWTytjrjnK5ZYXEDANMqtYILkOPY5ZYfcdcc/qil3JKFlLuMc/qmWH3EglkHVyGs8uZQuGsnPPDfmOmGevFVi8cy5jJi8GcM9eK1nhvzFgSQdnEazy5lC4ks8jnnh9x0wz14qIvoyShaL6MmGf1Vzw+4kAHVyVksb9CDIUksM45468x2wy34qyeUCqeC6eUbwy2xnjpAksgG7NsS68qFovoJLO5U4ecK7+M4uBF58wd5dzbjZq6S9+Zjawy4ksrxMZ47awy1VYvBYoWi+hnDL6rXJj9xJJAOrkq1hiLwyzWUUOGU63cd8b2mqyEERfQk7Y3c242auklGsMsGsoznjuNYZaqsXhlihaLM8eX01yY/aSWsogHVyUezLRfQSWVkqcL/ABXef3iuAnlA7y7cPQ1lFC5WS3OXJj9uvHl9LReV4gqnhlzWGW4znjqoIkupJL3RrKbmmcbq7Y1szJ0MbLRe2Dlx3V068k3NxJJAOzio1hlovoJrqVOF/jJ3n94rglbog7uCJLYqZDG1hnHkn268d+l1ugRF9CTrjdxjKaugq1hlhNbGeSbi8d1URfQkoX8icd8aXkmrsE1sCTeU3NMS6u2NGTmjGWg9sHLjurp15JubSSQDs4qFovYSREXhnCfzk73+sVgAd3BEluRHmWe6KHDKdctu+H9Y6XAT2B3l24EuRQyGN7M5ck+3Xjv0yLfBBEXtgk6Y3c255TV0kxsuRPmY5J423x3zpUAHF3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASixQsuhFiQAGgAAAAAAAAAAAgFzAkAEUAAAAASAgGgAACyKkolWLAAKgkBEqwABlpZElVzLBYguVJiGokAEVYgIkgnoCIkkaCVsyAGmQELkSZUJXIgIVqLIIgnoRqLAhEhpKJRUkjUWJXIgIixJJBKJWoEoglEaWJRVEmVWRL5lSSVqJLIqCNLklSURVkSiqLEagWRUlGWosSQERpYIAglEkEkVYEIlEaWLFEWRkiUWIHQzWolFkVJI0sSVLIlWJRKKlkZFkZKXtvyMSMlL235HDn/AMV6OH/cZiUQSj8uv1kosiqJRkWRYqiUSiUSyESZqiZdFORZGaqyJRVEmVWRKKljIsiyKIsjFVZEoqSRVuhJCJM0AAQAAAAAAAAAAAAAAAAAAaAAAAABDBJAAAEQABVAAAAAAAACGSQUQAAAAAAACASyAAJ6EAfIwAfTnycAAAAAAAAAAAAACcsgFls9JcZfayl3JTRQG5yWMXilXBVNolS7m5ySud47EgnOUQbYBhMAWb9kuvSriQXDWTneP8dJyfqqbRZNMq49iDEyyx9t9ccvS4KptFk0zrjnK5XCwABpkcUVawWJ6GMsJW8c7PbGngupZIcexU57uDpqZrgqpdy6OuOUrlljcUBrIBr2yq1ggyFXHsccsNeY7Y578VKefMFCyl3Ljn9VM+P7iQSQdXIaz5lC4az5nPPDfmOmGevFVi8FzG1glPBnHPXitZYb8xYE+RB2cRrPmUZcNZOeeG/Mbwz14qsXjyLmNkxeDOGevFbzw35iwJIOziiSzuipciS6o5Z4fcdePP6qYsFC8XkuGe/FTPDXmBO2CAdHNRrBKeCzWSjOGU63cd8bMpqshBEX0JO2OXaOWWPWhElgkljLHtDHLrWNbF08oq1hhPBxxy63Vdcse03FgSQd3BEl1KmQo1hnHPHXmO2GW/FWTygVTwy50wy3HPPHVQRJdSSS5Tc0mN1dsZdPKKtYYi8M443rdV2znabiwAO7giS6kJ4ZdrJjexxzmruO2F3NVkRBEX0JOuN3NuWU1dJKNYZYSWTOeO41hlqqxe5YoXTyjPHl9NcmP2B7oA62bclC0XsJLchPDOE/nJ3v9YrAkg7uCJLqVTwy5RnHOau3bju5pk6EERexJ1xu5tys1dJMb2ZcifczyTc21x3V0RZJRbMyE4740vJNXaCJLbJI57G8puaYl1dqGTxMZaL2OXHdXTryTc2kkgHZxULQewkupCeGcJ/OTvf6xWAB3cESRCeGWayihxzmrt3w/rHS4CeUDtLvy4Wa8DWUyhcq9mcuSfbrxX6WT2BEH0JN43cYymqFXsyxEick3Nrx3VIvoSVTwyw47uHJNUIkupIayi5zcTG6qseZYoXXLJjjv03yT7BLkCTpZuac5dXbGA+YPM9UoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASuZAAuCCSNAACgAAAAAAAAAAlcgQiSKAAAAABJBKCwAAUAAFiSqLEagQmSCAAgRsLIqSuZCLAANLAiJJGoFipOdgBYgIixIAI1ExZcxl0SqkABpKBCJM1uJXMsVJQVJKIBGosiSpYKlAhEkrUSAgZaiUWKolErSyJRUkirdQR2JMtJRJCJJWosSiqJRFiyABGlkSVRYy1EklUSFWRKK9STKpRbxKlkRYkkqiURVwiESjKrEor0JMtLIkqWCpJRVEmKqyMlL235GNF6PtvyOPP8A4rtwf7jOiSCT8ux+uksiqJRlVkSiqLIgt1JRC7BGVSwmCOTMrGREoqiUZFl2JRUt1M1UosiqLIzRZEoqiTDUWRPQqWRKJABkAAAAAAAAAAAAAAAAAAWAACgAABDJAEAAiAAAAAqgAAAAAACiGQSQAAAAAACCQwIAJQHyIAH058nAAAAAAAAAAAAAAAAAAAAAAspdyoLLZ6S4y+100wUJTaOk5P1yy4vxYBNA6yy+nOyz2BrIAs2npVxZBcNJnLLj/HXHk/VVIutyjWCCTOzxVuEy8xcEKXck6yy+nKyz2BrIBbN+yXXpVrBCeDJzKNYOOWFnmOuOcy8VZPIKFlLuax5Pqs5Ya8xIAOjmNZ5FC4ayc88N+Y6Y568VVPBfyMbWCU8Gcc9eK1lh28xYE5yQdvbiNZKNYLhrJjLDbeOevCqeC/TYxtYJTwYxy6+K3lj28xYE9CDs4jWShcSWTnnhvzHTDPXioi8eRJQtF9GTDL6q54fcSADq5KyWN1yIRkKNYOOeOvMdsMt+KsnkFU8Mubwy2xnjqoElkA3ZuaZl1dqFovoJLqVOHnCu3jOLgJ5B3l24WaGsooXIkupz5Md+XTjy14pF9CShdPKHHl9HJjryBrKAOlm3OeFC0X0El1KnDzhXfxnFwE9gd5duHoayihcrJHLkx+3Tjy+lovK8QVTwy5rDLc0meOqgiS6kkmspuaZl1dsZdboq1hiL3wccL1unXOdpuLAA7uKslhiLwyzWUUOGU63bvje01VwIvKB3l3NuNmrpLWTGXIkupz5MftvjurpMXsCqeGXLx3cTkmqgiS6kh8jWU3NM43V2otmZDGWi9jlx3zp15JubSTzIB2cVGXgyJLqQnhnCfzk73+8VgAd3BEl1ITwyzWUUOOc1du2F3NLgLkDtLubcrNXQ1lFC5WSwzlyT7dOK/SyeYgiHPBJvC7jGc1QrJblhPkTkm4uF1URZJRbMyE4740vJNXaCJIkPc3lNzTGN1dqLZlyhdbo58d+nTkn2BrYA62bcp4ULp7FXzJiccPGWnbP+sdpAB2cVHsy0RJER5nCfzk7X+sVgAd3FWXMgvJbFDz5zVejju4AAy2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlFihYiypAAaAAAAAAAAAAAJICAkAEUAAAAASAgGgAASWKEoixYABUIkAzWoAAirElUWCwRYqTF7BqJABFWILQhObxCMpPwWT0U7C6nyoyX823+SDzg2NLR7iS9aVOK88nohovv1/lEjbTFos6Cno9sl6zqS82Zo6ZaR5Uk/NthrTmwdZCztorahS/tRljSpx9mEV5Iy1I45Rb9lN+RlVGq+VOb/pZ2BKJtrTkVa3D5UKr/AKGWVnc/+vV/sZ1pYNSOS/Yrr/16v9rH7Fc/+vV/tZ1yJJtdOQ/ZLn/1639jIdtXXOjUX9LOwXMsTbWnFunOPOEl5og7chxUtpJPzJtZHEknYytqEvao035xRjlp1pLnQh8NjO2pHJFkdNLR7OXKEo+Un+phnoVH8FWpHzwxtpoCUbeehVF93Wg/5k0eeekXkOUIz/lkv1IrwonqZalrcU/bo1Eu/C8GIiwRKIJRGosSVRKMqsiUVyWTI1EkoqSiNRbqSQERpYBBEFkEQSRpbxJKokirElUWRkiUWKokzWosiUVJI0sSQESxYsjJR9t+RiMlH235Hn5/8V24P/yRnLIqSj8yx+ukkglGVWRKKolGRZFupVFl2JRKDIJMqJl0U5MsjNirIldiqLGVSiyKFkZFyUVRKMVVkSipJKqxJCJM0AAQAAAAAAAAAAAAAAAAAAaAAAAABDBJBAAAQABYsAAAAAAAACGSQUQAAAAAAACASyAPkYAPpz5OAAAAAAAAAAAAAAAAAAAAAAAAAAASpYIBZdeksl9rppgoSpYOmPJ+uWXH+LAJ5B1l25JKuPYkEuMvtZbPShKeCzWSrWDjcbj5jtMpl4qyeQUWxdPPmdMc9+3PLDXoABthDWeRUuGsnPLDfmOmOevFVTx5FzG1glPBnHPXitZYS+YsAnkHaXbilrKKNYLEtbGMsNt459VE8Fk8oq1ghPDOeOVxuq6ZYzLzFwE8oHeXbh6GslWsFg1kxnhtvDLqqnguY2sMlPHkYwy14reePbzFgSQdnFEkVLkSXVHLPD7jrx5/VIvPMkoXi8ouGe/FTPHXmBLWSAdL5c1GsExeC0llFDhZcL4d5ZnNVcERfRknbG7m3GzV0ko1hlg1kmeO4uGXWqp4ZcxlovoznhlrxXTPHc3EgA7OKslhhPDLNZKHDKdbuO+F7TVZCCIvoSdsbubccpq6SUawywayjOeO41hlqqxeGWKF4vbxM8eX01yY/YS1kgHVyUZaL6CSKnD/ABk7/wC8VwSnsQd55cCSyihcrJYZy5Mft1479LJ5QKxeGWN4ZbjGc1QrJblg1sM5uGF1VU8MsULx3Rjjv03yT7A1lAHWzbkoXjuiJLfJCeGcJ/OTvf6xWAB3cETW+SE8Ms90UOOc1du2F7TS4C5A7S7m3KzV0NZRQuVktzlyT7dOO/S0d0CseZY3hdxjOaoVksMsJciZzcXC6qseZYoZCcd8aXknnaCJciSfA3lNzTEurtjMnMxstF7HLjurp15J42kl8iAdnFQvF7FZLcR5nDH+ctO+X9Y7WAB3cFZcyYMS5FVszhf5yd5/WK4AO7giXchcyz3RQ45zV278fnHS4C3QO0u3AlyKGQxvmceSeduvHfGmTmQI8gdcbubc7NXSehjLlZcznyT7dOK/SAAcnYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRAAuCOZJGwAAAAAAAAAAAABIIRJFAAAAAAkglBYAAKEkAC4KosRoIRIIoC9OE6jxCMpPwR7KWmV5+3w014vLJpdvAWW5uqWlUY/eSlN/JHtoUKVLanTjHxS3LomTn6VncVfYpSx3awj2UtJrNr0k4QXhuzdSkorM2kvFnlqahbU/3ik/4dxpdq09IoR9uU5vzwj007K2p+zRh8Vn/ACeCWsxSxTpN+Mng81TVbmXsuMF4L6mW/boYpJYSwiJ1IU/vJxj/ADPBy1S6r1Pbqza7ZMSzJ4SbZFdNLUbWDeayb8E2Yp6xQXswqS+CRpYWdxP2aNT4rB6aelXUlvGMfOX0I1K9b1tr2KC83IxT1q4fswpr4NloaLUft1YLyTZnp6JTwuKtN+SSI1Hi/wCVu3sqij5RRSV/dS515/B4NtHR7aPN1JecjPDS7NL7rPnJkrUc/K6uJc69V/1sxurUfOpN/FnUxsLVfuIfFZLq0t1yoUv7ERrTk3Jvm2/iEdfGhRXKlT/tRdUqa5U4fIjWnHIk7L0cPcj8ifR03+CPyIunGp4LRqTXKUl8TsPQ0nzpQ/tRH7NQb3o0n/QhtqRyiuKy9mtUX9TLxvrqPK4q/GTZ07sbV87el8IpFJaZZy50I/BtE2umijql5HlWb80mZYazdx5uEvOP0No9Hs3yhKPlJmOeh279mpVXnhmbpqbeaGvVV7dGD8m0einr1N+3RmvJpmKWg+5cfOP+zDPRLmPsypy+LRGo2lPWLSftTlD+aP0PVTvbaovUr0/Jywzmp6ZeQ50W/wCVpnnqUatP7ynOP80WiWNbdtFppNcis6NKqvtacJ/zRTOKp1J03mE5Rf8AC8Hspand0+VaUl/FuZsWVvqukWdTlTcH3izx1dBX7qs/KS/UxUtdqrCq0oT/AJXg9tHW7aX3inTfisr8ieVaurpF3S5QU13gzyVKdSk8VISg+0lg62jd29b7qtCT7Z3+RnlFSWJJNdmibacSSjqq2l2lbP2Sg+8Nv9Hgr6E1vQrJ+E1+qJtWlRJ6a9hdUMudKTS6x3X5HlDSwIRYy1EkkIlBUkoqiUzKrIsULIjUSSVJRKL9CUVTJMtLBEJk8jLSyJRUsBJko+2/IxoyUfbfkefn/wAV24P/AMkZwQiT8x+usgQiTNVJYqiUZVZFkyiLIgsSiOgRlUslEAysXJKolGBYlEInqRVkWKIsjNgsSiqJMNRZE80QSiUSADIAAAAAAAAAAAAAAAAAAsAAFAAACGSQwAAIgAAAAKoAAAAAAAohkEkAAAAAAAgkAfIgAfTnycAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALKXcqDUys9M3GX2yEFU8Fk8nbHOVwywuISQDTKHHsVLhrJyy4/uOuPJ9VCl3LGPkSngmOevFXLDfmLALdA7e3EayirWCwM5Ybaxy6qJ4Lppoq1jyIWxymVxuq63GZTcXAi8g7y7cLNJ6FGsFiehnLHbWOXVjTwXTyirWCE8HLHK43VdcsZlNxcEp5IO/twGslGXDWTnnhvzHTDPXiqxZYoWi+jJhl9Vc8fuJAB1clZLHkQtmZOhRrDOOeOvMdsMtzVWTyCqeC50wy3HPPHrUESXUkFym5pJdXaheLyVksBPDOON63y7ZTtPCwJIO7giSyipcrJYOXJj9uvHl9VZPKBVPDLmsMtxnPHVQRJdSSTWU3NMy6u2MunlFWsMReGccb1uq7ZztNxYAHdwVkgnhl2tjGcc5q7jthdzVZCCIvoSdcbubcspq6SUawyxElsZzx3NtYXV0iL6FihdPJOPL6XkmvIJLKAOlm/DEurtQvF5RWSwxF4ZwxvW6ds/wCsdxYAHdwVksMReGWluihwynW7d8P6x1VwFugd5duFmvA90ULlZLDOXJPt14svpaO6BWL3LG8LuMZzVCslhlhLdDObi4XVVi9yxQyLdGeO/S8k87QJLYEm7NzTEurtjMi3RjezLRZy47q6deSbm0kkA7OKjLRewkt8kR5nCfzk73+sVgAd3BWXMR5lpLYocMv5y27Y/wBY6XBK5EHdxRJbFepk5mM48k87duO7mmQgR5A6y7m3KzV0l7oxlysuZz5J9unHfpaO6BEOqJN4XcYymqFXsyxEick8ba47qkSSseZYcd3EzmqFZcyxEuQzm4YXVRHmWKLZlycd8aXknnYRLoSHyNZzcZxuqoADzvSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUWKFuhFiQAGgAAAAAAAAAAQtixAQIkAEUAAAAASAgGgA9FG0rVsYjiPeWwLde2AvCMpyxCLk/BZNnR06nHeq3N9uSPfShCEcQiopdkXqx8k9RqaOm1p7zagvmz20dPoQ9pOb/iM1a5o0fbmk+3Nnirap0o0/jL6DxF3lW0pJQ9WKSXZIrWuqNH7ypFPst2aCrdV6ueOo8dlsilKnOq8U4Sk/BGbW8cf1taurQX3VNy8ZPB46uo3E+UlBfwoyUtLrz3m4wXjuz2UtLox3qOU38kTzWvEaeU5VHmcpSfdvJlpWler7FKT8WsI6ChQpUtqdOMfFLczSkorMmkvFjTUyaSjpNZtcc4QXzZ7aej0V95UnJ+GxlqX9tT51FJ/wAO5556zTS+zpSk/wCJ4JWsa9tOwtocqMW/4t/8nppxjFcMYqK7JGhqatcS9hQgvBZPNO9uZ+1Wn8Hj/BGnUSkorMmku7Zhle20ParQ+Dycu25PMm2/EvChWn7FKcvKLIroZ6rax5SlLyj9TE9apL2aU354RrKenXU1tRa82kZoaRcvm6cfNka29Etcf4aCXnLJT/m6/KMKS+Df6loaJNpcVeK8o5MsdEgvarSfksEa8vM9XunylBeUSj1W8f73HlFfQ2cdFt8bzqv4r6F1o9quam/6jLU2071K7z9/L5If8hdP9/P5m7Wk2a/dt/1MtHS7P/p/+n9SVqStEr+6/wC+p8yVqF2v38/mb7/jLP8A6V/c/qW/4uy/6f8A6f1DUaFajdr9/IutUvF++fxivobv/irN/umv6n9Sr0i0f4JL+pkVqo6veLnUi/OKMkdbulzVJ+cX9T3vRbV9aq8pL6FZaFR/DVqLzwyeGpt5467VXtUYPybRnjr0X7VBrylkpLQfcuPnD/ZjloddezUpvzyieFm3uhrds/ajUj5pHphqlnPlWS800aKekXkeVOMvKSME7G6h7VCp8I5M6aldbTr0an3dWnLykmZUcPKMovEk0/EyUritS+7q1I+UmLGtuuqWlvU9ujTb78Kyeapo9pP2Yzh/LL6mlpatdw/eKS7SSZ7KOuzW1WjF+MXgzpWSroL/AHVdPwlH9TxVtJu6f7vjXeDybejrVrP2+Om/FZ/we6jdUK2PRVYSfZPf5GWnHzpzpy4akJRfaSwZqF7cUceirTSXTOV8jr5RjJYlFSXZrJ5K2l2lX91wPvB4/wBDatZQ12tHCrU4TXdbM2VvrFrV2lKVN/xLb5nhraE93QrJ+E1+qNfX0+6obzoyaXWO6MtOupVIVI8VOcZrvF5MVxZ29xn0tKLffk/mcfTqTpS4qc5Ql3i8Gyt9auaeFU4asfHZ/Mmlj2XGhReXb1Wn7s/qay4sLm3y6lJ8K/Et0bu21m2q4VTipS/i3XzNlTnGceKEoyi+qeURqVxKJOsudOtrjLnTUZe9HZmqudEqwTdvNVF2ezDTUklqlKpRnw1YShLtJYKIgsSiqZJGlwQgjKrIsVRKIsSixXqSmZrUWRKKkkVZGSj7b8jGZKPtvyOHP/iu3B/uM5JUlH5b9dYlFSUSqksVJRlViUVRKMi6ZPUqiehKLIMhEmViUWKJ7lkZqrE815EIlbGVSiyKFjIuSVRKMVVkSiqLEqrAgkzQABAAAAAAAAAAAAAAAAAABoAAAAAEMBgiAAAAAqgAAAAAAABDJIZRAAAAAAAAPkQAPpz5OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALKXckoSng648n1XLLj+4sCckHVxGslWsFiemDGWG28c7ixp4Lp5KyWPIg5zK43VdLjM5uLgReQd5d+XGzXipKNYLEmcsey45dWMunnzKtYIOUtwrrZM5uLgJ5B3l24WaOa3KtYLBrJnPHbWOXVVPDL9DG1glPHkc8cut1XTLHt5iwJIOziiS6lS5El1OWeP3HXjz+qmL+YKF08lwy34qZ468wDWQDpZtznhQtF9BJFThd4V3ms4uBF5B3l3NuNmrpOMmNrBcSWVkxnjvy1hlq6Vi9yxQvF5Rnjy+muTHXkDWQDrfLkoy0X0El1KnDzhXf/AHiuAt0DvLtw9EllFC5WSOXJj9uvHl9LRewKJ4ZkNYZbjOeOqgiS6kg1lNzTON1dqLYyczG9mWi+hywurp15JubiSSAdnFVrDEXvgtJbFDhf5yd5/eK4CeUDvLtwJLKKFyrWGcuSfbrx36WTygRF74JN4XcYymqFZLDLCW6JnNxcLqqxe5YoZFuicd+l5J9oEt0CTdm5piXV2xl09ij2ZaL6HLC6unXObm0kkA7OKj2ZaLEl1ITwzh/nJ3/1isADu4IkQnhlmsoocc5rLbvh/WOlwE9gdpduA1mJQuUfM5ck+3Xjv0unsCIvbBJ0xu455TV0kxsuRPmY5J423x3zojyJKx5ljWF3EzmqFZcyxEuRM5uGF1UR5lii2ZcnHfGl5J52ES5Jkh8jeU3Gcbqqx5lihkW6OfHfpvln2gS3QJ5nSzc05y6u2MyGMvHkcuO+dOnJPGwPdAHazbkoXXIq9myY8jjh4unbk8zaSSAdnFQEy5kHms1Xqxu5sABFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUQALgjmSRsAAAAAAAAAAAjqSAJBCJIoAAAJjFyaUU2+yPZRsZSw6r4V2XMslvpnLOY+3jjlvCWWe2hp9SphzahH5s9lKjCksQil49TLK4p0ofaSSa6dTfTXmuU5u11ChaUaOHGOZd3uZZzjBZnJRXdmtr6lJ5VGPCu75nhnOdSWZycn4k7Sem5hb5raVtRpxyqSc335I8NW8rVOc3GPaOxNGyrVd+Hhj3lse6jp9KGHNub8dkTzV/nFrKdOdSWKcXJ+CPZR0yrLDqNQXbmzbUoxjDhikkuiRirXdGjtOab7Ldk669t97fTHS0+hT5xc33ke2niOySS7I1NbVG9qNPHjI8VW5rVfbqNrtyQ3CS+639a7oUvbqRz2W7PHV1aK+6pt+Mng1dKlUqv7OEpeSPZR0utP7xxgvHdmN111GOrqNxN7SUF/CjzznObzOUpPu3k3FLS6Md5uU38ke2hQo0vu6cIvvjcaWWOepWter7FKbXfGEeyjpNeT9dwgvPJum0lmTSXdmCrfW1PnWi3/AA7jS7YKejU195VlLyWD0w061hj7Lifdts809YpJepTnLz2PPU1is/YhCPnuZbbqnSpw9inCPlFIynLz1C6nzrNfy7GGdWpU9upKXm8kV1Uq9Gm/Xqwj5yRjnqNrHnWXwTZzEYyk/VTb8EZ4WlxPlQqf24I1K3f/AC9tH35eUSktbo/hp1H54RrY6Zdy/dY85Iyw0a5kt3Tj5sjUr1f86uSt38Z/6IeuT6UYrzkY46LV61YLyTZljobfO4S8of7JWvKj1yv0pU/zI/5u4ztCl8n9TOtDj1rv+3/ZZaHT/wC6fyRPDXl5/wDm7n3KPyf1JWt3PuUfk/qelaHS/wC6fyQ/4On/AN0/kiNTbBHXLjrTpfJ/Uutcq9aMPmzL/wAFDpXl/aQ9CXS4+cP9kXyR11/it0/Kf+jLHXYP2qEl5SyYHoVTpXi/OJR6JcLlUpP4v6E8NTb3w1u2fONWPwX1M0NWs5fvXF+MWaaWj3i5QjLykjFLTruHOhP4bk1Gt108L21n7Nen8ZYM8Jxksxaa7pnFyo1Ye3SnHzi0VTcXlNp+BLFldvKKksSSa7NGCpYWtT2qEPgsf4OXp3tzTxw16mF0csnqp6zdx9pwn/NH6E01K2tTRbaW8HOHk8/5PJV0Kovuq0ZeElgmlr3/AG0PjGR7aWsWlT2pSg/4o/Ql2001XS7un+6cl3i8nllCUHicZRfZrB2FC4o1vuqkJeCeTLKEZrE4xkuzWTNqxyNG9uaP3daaXZvK+TNhQ12tHCrU4TXdbM2VbSrSrv6PgfeDx/o8FfQXzoVk/Ca/VEae631m1q44nKm/4lt80bGlUhUjxU5xmu8Xk5Gvp11Qzx0ZNd47o89Oc6cswlKEl1TwyWK7KvaW9xn0tKMn3xh/M1txoUHvb1XF9p7r5ngt9ZuqWFNxqx/iW/zNpba1b1MKqpUpeO6+ZFae4066t8udNuK/FHdGCjWqUZcVKcoPweDsqVSFWHFTnGUe8XkwXFhbXGfSUlxP8UdmRqVqbXXKsMK4gqi7rZm4tdRtrnChUSl7stmam50Occu2mpr3ZbP5mqr0KtCXDWhKD8URqO0q0oVY8NWEZx7NZNXd6JTnmVtP0b92W6NTaalc2+FGfHBfhnubq01mhWSjVzSn47r5mSNHc2de1f21Npe8t18zAdsnGcekoteaZr7vR6FbMqP2U/Dl8iNOaRY9F3YXFq81IZh78d0eYNRKJRVFiCyJRVEozWliU8lUSZaWRko+2/IxmSj7b8jjz/4rrwf/AJIzolFUSflv11giESRVkCESZqrElUSjKrIsmVRKILEohcgZVPIlEBczNVckqiyMCehKIXMLYirpliiLIzRYlFUSjDUWRYqSSiQAZAAAAAAAAAAAAAAAAAAFgAAoAAAQySGAABEAAAABVAAAAAAAFEEEsgAAAAAA+RAA+nPk4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACU8Fk8lAbxy6sZYSrgJ5B3l36cLNe0lZLHIkGcsZVxyuKhdPPmRKPUqcpbhXWyZxcCLyDtLubjjZrxUlJLBYkmWPZccutY1sXTyirWCE8M5S3G+XWyZzcXATygd5duA1koXElnzOeeO/MdMMteKrF9CxQtF9CYZfVXPH7iSSAdXJVrATwyzWSjWDhlj1u4745dpqsiIKxe+Cx2xy7Ryyx60KyWCxJMsdwxy61jTwXyUawTF9Dnhlq6rpnjubiwAOzirJYYTwyzWUUZwznW7jthe01WQgiL6EnbG7m3LKauklGsMsGsoznjuNYZaqsXhlihdPKM8eX01yY/YGsgHWzbkoWixJdSq2Zwn8ZO9/vFcEkHdwRJdSpkMb2Zx5Jq7duO7mmRPKIIi+hJ1xu45ZTV0FWsMsRJbGeSbjWF1SL6ElDIuROO+NLyTV2gSWwJN2bmmJdXbGXW6KPZlo9jlhdXTrnNzaSSAdnFRrDLR7CS2TKrZnD/OTv/rFcEkHdwRJdSqeGXayihxzmrt2wu5pcCLygdpdzblZq6GtihcrJYZy5J9unFfpZPKBEWSbwu4xlNUKvZliJdyck3F47qkSSq2ZYcd3DkmqESRIlui5zcTG6qsdmWKF1ujPHfpvkn2CW6BJuzc05y6u2MyGMvHkcuO+dOnJPGwl7pkA7OShdckVlzJjyZxw8Zads/OO0gA7OKj5lo8iJcxHmccf5ydr/WO1gAdnFWXMmHVCXRkR5nH1m7e8FgAdnFE+ZEeZaXIouaOOXjLbtj5xXAB2cUS5IqXlyKHDknl347uAAMOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJRYoi5GoAAKAAAAAAAAAACCxB6La2lVe/qrxElvpm5TH2wJNvCWWeyhYylvVfCu3U9tGhTor1Fv3fMmtWhRWZvft1Okwk81wy5rl4xTSpQpRxCKXiVrV6dJevLfsuZ4a17OeVD1I/meaMZVJYinJsXPXiGPDb5zr01r2pPKh6i/M80VKcsJOUmeyjYN71pY8Ee2nThTWIRSJ1uXtq8uGHjF5KGnTlh1XwLst2bCjbUqPsQWe73ZWd1SpQ9eXrLot2eGvqNSWVSSgu/Nk8Yty5Z+WzqVIU45nJRXieKtqUVtSi5eL2RrG5VJZk3KT77npo2FaphyXAv4ufyJ2t9NdJj7Uq3VarlSm1HstkUpUqlV4pwcvJG1o2FGnvJcb8eXyPbDCjhJJLsTrftqck9RqqOmVJb1ZKC7Ldnto2FCn+DifeW5ate0KXOfE+0dzw1dUm9qUFHxluPEX+q3FPEVhJJGOreUKXtVI57Lc5+rcVav3lSTXboKVGpV+7hKXkjNreOP62lXVoralTb8ZPB5Kmo3M+U1BfwovS0utLeo4wXzZ7KWl0Y+25TfyRPNa8Rp51J1HmcpSfi8mSnbVqnsUptd8bHQ0LejT9inFPvjczNpLLew01Lto6OlXEn63BBeL+h66ejR29JWb8IrB6ql7b0/arRz4PP+DDPWKCXqRnJ+WESxrGstPS7WPOMp/zP6Hpp2tCHs0aa8eE1NTWaj+7pRX8zyeeeqXT5TUfKKI06RJJYSwieJR9ppLxOUndXE/arVH4cTMTbby3lkV1krq3j7Vamv6kU/wCRtI860fgmzmYU5zXqwk/JZMsbS4lyoVP7WiNbb56taLlOT8osj/mrZbcNV+SX1NPHTbuXKi/i0jJHSbvO8IrzkiN7bN63Q6U6v5fUh65S/wCqfzR4lo90/wDrX9RK0W5f4qXzf0MrLXrWuU8/cz+Zb/nKX/TP5o8n/CXPv0fm/oFotz79H5v6Ea8vdHXKPWlU/IvHXLbrCqvgvqa56NdLrTf9T+hD0e7XKMH/AFEalrbLWbR83NecTJHVbOX77HnFmjelXi/c58pL6lHYXUedCfwWRpd100L+1lyr0/jLBnhVpz9ipCXk0zjpW9aHtUai84sxtNPdYJpqV3CKzo0qnt04S/mimcbCvVp+xVnHyk0emlqV3BbV5P8AmSf+SaaldDPTLOfOil/K2jzVNDoP7upUj54Z4aet3MfbjTn8MM9dLXoPHpaMl/K8mdVrbBV0KsvuqsJeaaPLV027pc6Mmu8d/wDBvKWrWlT944PtJYPZSrU6q+zqQmv4XkK41xlCWJJxkuj2PTQvrmjjgrTx2byvzOsqU4VFipCMl2ksniq6VaVc4puD7weDKvBQ12tHatThNd1szYUNZtam03Km/wCJbfNHiraFJb0KyfhNY/M8FfTrqjlzoya7x3/wRqOspVYVY5pzjNd4vJSva0K/3tKMn3xv8zjYSnTlmEpRkuqeGbC21i6pbTkqkf4lv8yWLK2NxodOWXQqSg+0t0ay4026oZcqblH3obo29trdvUwqsZUn80bKjVp1o8VKcZrvF5MtOOpVJ0pcVOcoSXVPBs7bW69PCrRVVd+TN1c2VvcZ9LSi5e8tn8zV3OhSWXbVM/wz+pFbK11O2uMJT4Jv8M9j2ThCpBxqRUovmmsnGV7etbyxWpyh58n8TNaahcW2FTqNx92W6JpqN1daLRqZlQk6Uu3NGnurG4tXmpB8PvR3RuLTWqNTEa6dKXfmjawlGpDijJSi+qeUyK5C1u69rLNGo0vd5p/A3lnrdKpiNzH0cveW8f8ARlu9Jt7jLgvRT7x5fI0l3p1xa5co8VNfijuvj2IsdbCUakMxcZQl1Tyma+80ehXzKl9lPwWz+Bztrd1rWWaM3Huuj+BvrLWqVXEbheil734X9CK013ZV7SWK0PV6SW6Z50dv6tSH4ZQa80zU32iwnmdq/Ry918n9CLtz6JL16FW3qcFaDhLx6lCNRZElUSmZrUWXIyUPbfkYuTMlH7x+Rx5/8V24P/yR6CSAj8uv11kSVJRkSiyKoklaSWKkoyqxJVFkZFk9ySqLdDNEoEIlkWJRYonuWRiqsSQiURVkSiqJMi5JVEoxVWJRVFkSqsCCTNAAEAAAAAAAAAAAAAAAAAAGgAAAAAQwGCIAAAACqAAAAAAAAEEkMogAAAAB8iAB9OfJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0XnmVBrHKxnLGZLgiL6Mk745SvPZZ7CJLsSBljKY5WVQtF5El2KnGW4V21M4uBF5B3l35cbNeKnoUawWDWTOeO1xy6qp4ZfoY2sMmLwc8MuviumePbzFgSQdnFEl1KlyslhnLPH7jrhl9VZPIKp4ZZbmsMts546oJLIBuzc0zLq7ULxeeZEl1Kp4OEtwrvdZxcEp5RB3ecksooXKyWGcuTH7dePL6Wi8oFU8Muawy3Gc8dVBEkSSaym5pmXV2xl1uirWGIvc44XrdV2znabiwAO7grJbhPDLPdFDhlOt3HfC9pqshBEXsSdpdzbjZq6S90Y2XIkupjkx8bb47q6IvoSUWzMhePLc0nJNXaCJLbJJJrKbmmZdXbGjIY3sy0Oxy47q6deSbm0kkA7OKjWGWi+gkupVPDOH+cnf/eK4JIO7gia6lVzMj5GM45zV27cd3NMhAi9gdZdzblZq6S1lGMuVlzMck+2+O/S0XsCsXuWNYXcZzmqFZLDLESWxM5uLhdVEXuWKIyE4740vJPO0ES5EkvdG8puaYxurtjXMyGMuuRz479OnJPsDW2ADrZtynhQut0VezJiccPF07cnnHaQAdnFR8y0eREuYjzOE/nJ2v9Y7WAB3cVZcyYiRC2Zxv85O0/rFYAHZxRIiPMtLkUOOfjLbth5x0uCSDs4olyKrmXfIoceTxdu3H5mlwFyQO08uJJbFDIYzjyTzt14740yECPIHaXc252ao+RQuUfM5ck+3Tiv0v0AjyB0xu452ap4FC5V82c+SfbpxX6QADk7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEogIC4AI2AAAAAABCy3sESTTpyqPEV8TPSts4dT5HqSUVhYSR2w4rfNePm/wCuY+MPNYqVCMN360jMqipPik8I89W5UcqG779DySlKbzJ5ZrLPHGaxccODk5b3zr3V75yyqSwu/U8i4qk+spP4sz2trKr7b4UvmbKlShSjiEUu76s5dcsvb2fJhhP5eKhYt4dZ4XZHup0401iEUkUr3FOj7Ty+y5mvr3dSplL1Y9ka3jixrPl//wAPfWuadLZvMuyPBWvKlTKXqR8DDTpzqSxCLbPbRsEt6rz4IzvLL031w4/ft4acJTliKcmbChpsnh1pY8FzPVCEYLEIpLwFS9pUo+tLil2juLhJ7XHmuV1GajQp0V9nBLx6irWp0lmpNI1dfUKs9oepHw5nkXFOXWUn8WZ7fjc47fNbKtqS5UYZ8ZHhq3NWr7c20+i2Rno6fVnvPEF47s91Gxo0+ceOXeQ1a1vHH01VKhUqv7ODl49D20dLk96s1HwW5tY4UeiSPPWvqFLZz4n2juTrJ7a7W+ilZUKfKCk+8tz1waSxySNPV1Sb2pQUV3e7PFVr1ar+0nKXh0JbFku910FW8t6XtVIt9lueSrq0VtSpt+Mng1dKjVq/d05S8keylpVaX3kowXzZnddNSKVNSuJ8pKH8qPPUqTqPNScpPxeTb0tLox9uUpv5I9lC2oU/YpQT74yxqrLHPU6FWr93TnLxSPVS0y5m94xgn7z+hvjDUu6FP26sE+yeRpdvFT0Z/vKyXhGJ6IaTbx9pzl5sT1a2ivV45eS+pgnrPuUfi5GW3vp2FrHlRi/Pf/JnjSpw9inCPksGhnq1y/Z4I+S+pinf3U+daS8tiK6hPoG1Hm0vM5GVerL2qtR+cmVzndkaldd+00Y+1WprzkirvbZc69P4SycrGMpcot+SLxt60vZo1H5RZGpXTrUbRfv4/mP+Ts1++X9r+hzcbO5/6Kv9rMn7DdP9xU+RK1uug/5Sz/7v/l/QLVLPP33/AMv6Gg/YLr/on8h+wXX/AET+RNNbrolqVo/3y+TMkdQtX+/h8zmf2K6x9xU/tIdrcR50Kq/oZGturhd28uVek/60ZY1KcvZnF+TOMdKpH2qc15ogi7duTKMZr1op+aOJhUnD2Jyj5Mz0766hyr1PjLJNNSupnZW0/aoU/hHB556RZy5QlD+WT/U08NXvI86kZecUeinrtVfeUYS/lbX1JprcempoVN/d1px/mWfoeWpolxH2JU5/HDPZS1yhJfaU6kX4YZ6qWp2lTGKyT/iWCXbU05+rYXVL2qE8d0s/4PPvCXVSXwO0p1IVFmEoyXdPIqUqdVYqQjNfxLJNq5WjqF1SxwVp47S3/wAnvoa5Vjj01OM13jsz31dJtKnKDg+8WeKtoUl9zWT8JrH5krT3UNZtam03Km/4lt+RsaVWnVjmnOM13i8nJVtPuqOeKjJpdY7/AODzQlKEsxcoyXVPDM2LK7Ova0K/3tKMvFrf5mur6HSll0KkoPs90a231e6o4UpqpHtNfqbO21yhNpVoSpvut0RprLjS7qhl+j4494bnkhOdKeYSlCS6p4Z2NGvSrRzSqRmvBkXFpQuF9tTjJ9+vzJtWitdauKWFVSqx8dn8zb2mq2tfCc/RzfSe35ngudC5u2qf0z+pqri1r2zxWpyiu/T5kV2UoxnHEkpRfR7pmuutGoVcyo5pS8N18jRWt7cW33VR8PuvdfI3FprdOeI3MPRv3luiaaay7064tsucOKHvR3RitrmtbSzRm4910fwOvpVIVYKVOSlF9U8nkvNLt7nL4fRz96P0MtSvNZ63CWI3UeB+9HdfI3FOpCrFTpyUovqnk5W80u4tsy4fSU1+KP6o89vcVbeXFRm4vr2YV0t5pNvcZlBeiqPrHk/NGivLCvaN+kjmHScd0bSx1unPELpcEveXL/RuIyjUhmLjKL6rdMyrk7K+r2j+ynmHWD3TOhsdVoXOIy+zq+7J7PyZ577RqVXMrdqlPt+F/Q0Vzb1bafDWg4v8n5EX27KtRp16bhWgpx8TRX2izp5nat1Ie7+JfU89hq1a2xGp9rT7N7ryZ0dpd0buHFRnnvF818CU9OOaabTWGSjrL/TqN4syXBV99fr3OcvbGtZzxUjmD5TXJkalecyUPb+BiTMlD7x+Rw5/8V6OD/8AJHoRJBJ+Y/XSiUVRJkWJICIqyBBJiqsSVRKIqyLLmVRKILEojxCMKFkyAnuSquSVRZGBJZFUSiVVkWKFkZqrEoqiUYWLIsVRKJRIAMgAAAAAAAAAAAAAAAAACwAAUAAAIJIYAAEQAAAAFUAAAAAAAUQQSyAAAA+RAA+nPk4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFovoyoLLpMsZlFwRF9GSejHLc281mqESWCSSZY7hjl1rGXTyisljyITwcsbca7WTObi4CeQd5duA1lFC5Ekc88d+Y6YZa8Ui+jJKF4vJMMvqryYa8wJIB1clGsMmLx5FpLJQ4Wdb4d5e88rgiLzsSdpdzbjZq6SUawywksoznjuNYZaqsXgsULxeUZ48vprkx+wlrYgHX25KMtF9BJdSpw/xk7/7xXBKeUQd5duBJZXiULlZLDOXJj9uvHl9LJ5QKxeGWN4ZbjOeOqFZIsGsoZTcTG6qqeGXMZeL2Mcd+nTkn2EvdEA6uKjLRe2BNFU8M4T+cne/3iuCSDu4IkupVPDMjWUYzjnNXbthdzTIQIvYHWXc25WaukvcxlysluY5J9t8d86WjyBWL3LGsLuJnNUKyW5YSWwzm4mF1VYvcsUMi3M8d+muSfaBJbAk3ZuaYl1dsZk5mNlovY5cd1dOvJNzaSeZAOzioXi9isuYjzOGP85ad8v6x2sADu4Ky5kxEyFszhf5yd5/WKwAO7giZEeZaXIocc/GW3bDzjpcEkHZxJcihk8DGceSedu3HdzTIQI8gdpdxys1R8mULlHzOXJPt04r9LrdAiPIk6Y3cc8pq6SYy5WXMxyT7b4750tHkCI9STWF3GcpqhR82XKy5meSeGuO+VocgViWNYXcZzmqFZcyxEick8Lx3yQJKx5lhx3wZzVCsuZYifQck8HHfJAkrHmWHHfByTyFZcyxEuSLyTwYXWSoAPO9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsiSiLkagAAoCD0Ubdyw6my7FxxuV1HPk5MeObyYqVKVR7Lbue2lSjTW277l0lFYWyPPWuUsqnu+56JjjxzdfnZcnJ/0Xrj6/8A+9s1SpGmvWe/Y8dWtKptyj2Rj9acurbPTRtutT5GLllyeJ6d8ePj/wCeds/NYKVKVR+ry7s9lKjGms85d2ZNkuiSPPVuUtqe77m5jjx+a45cvL/0Xrj6elVY0pKUnhGG4vZy2p+rHv1PFKTnLLy2eu1tHU3qPhS6dTnlnc/T08XFhwz+75eeEZVJYinKTPbQsVs6zz/Cj206cKceGEUjFXuqdHZvMuyJMJPNavLll4xZYRjCOIpJdkYa13Tp7J8UuyPBWuqlXKb4Y9kY6VKdV4hFvxFz+ouPD951krXVSrtnhj2RjpU51ZYhFs99GxjHDqPifZcj1pKKxFJJdiTC32t5scfGEeahpvWtL+mJ76VKnSWKcFFeB56t9Spxxnjl2ieCvfVqmVF8Ee0fqTcxbkyz8trWr0qK+0mk+3U8NbUnyowx4yNfGMqksRTk323PbR06pLeo1BdubJu3010xx9vLUr1Kr+0m34dC1G3q1vu4Nrv0NrRs6NLlHifeW57MpRy2kkTr+tTknqNXS0tverUS8IntpWdClygpPvLcrWv6FPOJOb7R3PFV1OrLPo4qC7vdjxF/qt1BpLHJIw1by3pe1Ui32W5z9StUqv7Scpeb2LUqFWr93TlJd0tjNreOPjy2dXVoralTb8ZPB5amp3Mn6slBfwotS0qtL7yUYL5s9dPSqMfblOf5InlrxGpqValX7ycpebyKdKpU+7pyl5LJ0dC1oU/YpQyurWWZxprbn6WnXU/3fCv4mkeuGjVH7dWC8k2bGdxRp+3VgvNmOeqWsVtNy/liyWNSsMNHpL26k5eWEeinplrFb03Lzkzyz1mmn6lKT83gwy1mr+CnBeeWRpto2dtHlRp/FZM0KdOPswivJHPS1W6fKcY+UUYpX11LnXn8NiLHVFo9jkXc1pLetUfnJlHOT5yk/iRuV2TaXNkqpDG8o/M4olbMiyu09LT9+PzJ9JB/jj8zjQZ9tzJ2kZRfKSfxLnEFoya5NomlmTtlyDjGSxJJ+aONjXqx9mrUXlJmWN9dR5V6vxlkjUrqZWlvL2qFJ/0oxT0yzlzopeTaNDHVbyP73PnFGeGt3MfajTl8GiaXbYz0S2kvVlUj8cnnnoL/AHdf4SiKevf9lD4qR6aetWsmlL0kPOOf8Dy1NNdPRrqHsqE14S+p5qtnc0vboVEu+Mo6Slf2tT2a8Pi8f5PVGSlHMWmu6JtqRxcW4yym0/A9VHUruljhrSa7S3/ydRUoUqq+1pwn5rJ5KukWlTeMZU3/AAv6mdtPDR12ovvqUZeMXg99DWLWphSlKm/4keGtoU19zWi/CSweGtp11RzxUZNd47/4GldXSqwqripzjJd08kVrajX++pRl4tb/ADOMjKUJZi3GS7bM99vq13SwnNVF2ms/mZ0u20r6HRnvQqSpvs90a240q6oZah6SPeG/5czZW2uUZtKvCVN91ujZ0LilXjmjUjPyfIz6acbGU6U8xcoyXbZo2VrrNzSwqjVWP8XP5m/r21G4WK1OMvF8/may50KLy7ao4v3Z8vmFeu11e2r4UpOlJ9JcvmbH1Zw6Si/imcdc2Vxbfe02l7y3XzFtd17Z5o1JRXbo/gZ006G60e3r5dNOlP8Ah5fI093pdzbZfDxw96G577TXIvEbmHC/ejuvkbijWp14cVKcZx7pkVx9CvVoT4qM5QfgzdWeuco3UP64/qj3XenW91lyhwz96OzNLd6TcW+ZQXpYd4rdfAjUdNQrU60FOlOM490zy3mmW9zmXD6Oo/xR/VHL0K1W3qcdGcoS8P1N3Za5GWI3UeF+/Hl8UTStde6dXtG3KPHT9+PL49ilpeVrWWaM2l1i90zrac4VaalTkpxfVbmvvdIo18yo4pVPDk/gRV7DV6NxiFX7Kp4vZ/E2NWlCtBwqwUovozjbq1rWs+GtBrs+j+J6rDVK1riMn6Sl7r6eTJYr2X+iyhmdo3KPuPmvI1NOdShVzFyp1IvyaOts72jdwzSl63WL5orfWFG7XrrhqdJx5/7IbePTtajPFO7xGXvrk/M3Mowq02pKM4SXmmjkL6wrWcvtFxQfKa5GTT9RrWbST46XWD/TsZsa09+o6M1mpZ5a5um+nkaikmqrTTTS3TOtsryjdw4qUt1zi+aK3enUruTl7FXG0l18zhz/AOK7cGWs5tzZZGS6tqtrU4K0cdmuTMR+Y/ZlSSQESqsiSpYyqSUVRKJVSWKkoyqxKKosjIsmSVRYzRKI5BEsjUSmWKIsjFFi3iVRKIqyJRVMlGRckqiyMKlEohEolVYEIkzQABAAAAAAAAAAAAAAAAAABoAAAAAEAMEQAAAAFUAAAAAAAAKliGUQAAPkQAPpz5OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFovoVBrHLVZyx7RcCLz5g9Eu/Lz2a8VPQo1gsGsmM8drhl1VTwy5jezJi8GMMteK6Z478xYAHZxRJYKrYyMo1hnHPHXmO2GW5qrJ5BWLwyx0xy3HPLHrQiS6kklym5pMctXbGi6eUVawxF4ZywvW6rrnO03FgAdnFWSCeGXa2MbOOc1dx2wvaarIQRF9CTrjdzbllNXSSjWGWEllGc8dxrDLVViyxQunlE48vprkx+wNZQB0s25Tx5ULxeUVksMReGcMb1yd8p2x2sADu4KyXUJ4ZZ7lDjnNXbthdzVXAjuvIHWXc25WauktbGMuVktzHJPtvjvnS0Xt5ArHmWLhdxM5qhWS3LCW6LnNxMLqqx2ZYoXTyjHHfpvkn2B7oA62bmnOXV2oZFuij2ZMTjhdXTrnNzaSSAdnFR8y0XsJdyI8zhP5yd7/WKwAO7gifMiPMtLdFDhl/OW3bH+sdLgnsQd3ElyKIyGM48k1du3HdzTIQI8gdpdzblZq6Huihcq9mcuSfbpxX6WXJAiPLBJ0xu455TVSY3zLlZczHJPG2+O+dJjyJIhzJNYXcZzmqFZcyxE+5OSeF47qkOpJWPMsOO+DkmqFZ8yxElsXObhhdVEeZYqtmixOO+F5J5CJdCRLkXObjOF1VY8yxQuZ47401yTzsIlyJD5M3lNxjG6qq5lihkMcV+m+SfaBLkA+RvKbjGN1VFzLlDIjnx36dOWfaCJciQ+R0y8xzl1VFzLlDIuSOfFXTlnqoEvZBLOl8xzl1WMAHmeoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACy5FSUFWEYuTxFZZalTlUeI8urPbSpxprEefV9zeHHcnDn/6MeLxPalGgoYct5f4Ms5xgsyeEUrVlT25y7HhnOU5Zk8s65Z44TWLycfDnz3vn6ZK1eVTZbR7FaVKVR7bLuZaNvnEqmy7HrSUVhbJGceO5ecnXk/6MeKdOKKUqUaa2W/cVasafPd9kYa1zzVP5nm9acurky5ckx8Yscf/ADZZ3vy1erVlU57LsKVGVR7LC7sz0bZLepu+x6G1Fb4SRMeO3zk1yf8ATjhOnFFKVKNPksvuXVaNFpyfwPNVuelP5nm3lLq2y5ckn84s8f8Az553vyV6695OplR9SP5mCnTlUliEW2em1tONcVR4x+FGxhCMI4ikl2Ry6W+3qvLjjNYPHQsYx3qvifZcj2JKKwkkkYK93Tp5SfHLsjX1ripV9p4XZcjW5j6ZmGfJ5r3Vr2nT2j68vDkeGtcVKvtSxHsuRFGhUqv1I7d3yPdRsqcN6nrv8jP9ZN/xx/8A+Xho0alV4hFvx6GxoabFYdaXE+y2RnWIrokvyMdXUKUF6vry8OXzFxmPtceXLPxHrp0401iEVFeCMda5pUdpzWey3Zqa97Wq7cXDHtHYw06c6ksQi5PwM9vxucf3XtralJ7UoqPi9zxzrVKr+0m5ebPZR02b3qyUV2W7PdRtaNLeME33luNW+2u2OPpqaNrWrexB47vZHto6X1rVPhE2bkoxzJpLu2eWrqFCG0W5v+EmpPbXa30yUrOhT9mmm+8tz1QeFvskaSrqdWX3cVBfNnknWqVH9pOUvNktizG73XQVb23p+1UTfaO55KmrQX3dOT8ZPBrKVvVq/d05SXfGx66WlVpY43GHxyzO66akVnqdxJ+q4w/lR56lerU+8qTl4Nm1p6VSj7c5SfyR7KNnbwXq0Y5XdZ/yNVZY5yEJTeIRcn2SyemlY3M+VKS/m2/ydEkksJYRWVWnT9ucI+bwNNbamGkV37UqcfjkzQ0ZfjrP4RPZLUbWP71PyTZhnq9BezGpL4JGWkw0i3S9aVSXm19DNHTLSP7vPnJnilrWPYofORjlrFd+zCmvg2RW3hZWq/cQ+KyZFbUFyo01/SjQPVbp8pRXlEq9Su5fvn8EiNSumhTppbQivgWUYrkl8jlf266z9/P5j9tuf++p/cRuV10eQwuqRyKvLlP7+r/cy37bcr9/V/uZK1t1jpwfOEX8CvoKL50qb84o5dX90uVefzLLUrtcq8vikzOmuzpJWVtLnQpfCKRR6ZZyW9FfBtfqaOOrXa51E/OKMsNauY840peaf1Cyxs5aNavlxx8pfUwz0Om/YrTXmkzBDXZp+vQi/KWD0Q1yk/bpVF5YZGvDBPQ6q9irCXmmjzz0q8hypqS7xkjb09WtJ86ji/4os9dK7t6nsVqbz04lknlY5Spb1qX3lKcfFxZSnOVOWYSlF908HbIw1bahV+8owl4tbk21pzlLU7unyrOS7SWT20ddmvvqMZeMXg9dXR7Wa9VTpv8Ahf1PHW0Kot6NaMvCSwS6am2woaxaVMKUpU3/ABI99KrTqrNOcZrvF5OTrafdUfaoya7x3/weaMpQlmLcZLqtmRZXZ1rajXX2tOMvFrf5mvr6JRnl0Zypvs90aq31a7pYTn6RdprP58zZ2+uUpYVem4PvHdGdVp4K+k3VHLjFVI94fQ8XrU5fihNfBo7C3uaNxHNGpGfgnuvgWr0KNeOK1OM14rkSq5y21e6o4UpKrHtPn8zb2us21XCqZpS/i3XzMF1odOW9vUcH7st0am5sLi23qU24+9HdE8Vp2EZRnFOLUovqt0zw3WlW1fLUfRz7w+hzVtc1rd5o1JR8FyfwNxaa5yjdQ/qh9CWK8l1pNzQy4r0sF1jz+R5KVWpRnxU5yhJdU8HX29xSuI8VGpGa8Ohiu7C3usupDE/ejsybaa2z1ySxG6hxL348/kbq3r0riHFRmpx8Ohz15o9ejmVH7WHhzXwNfTqVKNTipylCa6rZkV1d5p9vdJuceGp78dn/ALNFeaZXtcyx6Sn70enmj2WOttYjdxz/ABxX+UbqjVhWgp0pKUX1RlpyVrdVrWfFRm4910fwN/Y6xSrNRr4pT7/hf0LX2lUbnMofZVO6Wz80aC7s61rLFWG3SS5MK7CpCFWm4zipxfR7o0t/orWZ2jyvcb/wzX2GpVrTEU+Ol7kv07HR2N9Ru4/ZyxPrB80ZHKxdShV24oVIvyaZu9P1pPELzZ9Ki/U2F7Y0buP2kcTXKa5o52/0+tZvM1xU+k1y/wBEa9utXBVp4fDOEl5pml1DRsZqWfLm6b/Q1un6hWs5Yi+Kn1g+Xw7HT2N7RvKeaUvWXtRfNEp6clTnUoVeKDlCpH4NHSaTq8K81TuMQq49rpL6GXUNOpXiz7FXG01+pztW1q2lw4Vo422a5PyOHP8A4rtw6ucdpXowr03CrFSi+hz2o6bUtW508zo9+q8y2m6rOhincZnS6PrE6GnOFWmpQalCS5rqfl1+n5wcagbvUtJ51bRedP6GkaaeGsNB2xyl9JJRCBlpYlEAirIkhAxWliSqJRBZFkVRKM0WRJD7hGVTyLIqwmSquSQiUYElkVRKJVWRYoiyMWKsSQiUZWJRYqiehKJABkAAAAAAAAAAAAAAAAAAWAACgAABBJDAAAiAACgAKAAAAAAACioJZAHyIAH058nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALp5KEp4ZvHLrWM8dxYBPYHd5ySyULkSXU5cmP3HTjy+qRZJQunlFwy34M8deYBrKAOlm3OXXlQtF9BJdSpw84V38ZxcBboHeXbgSWUULlZLqcuTH7dePLXhaLygVTwy5rDLcZzx1UESW2SSTWU3NMy6u2MyJ7FGsMmL6HLC6uq65zc2kAHZxVksPwEXhlpLYocMp1u474/1iuAnlA7y7cLNDWxQuVksM5ck+3Xjy+lovKBWPMsbwu4xnNUKyW5YS3Qzm4YXVVjzLFC8d0Y479N8uP2CS2AOtm3KXV2oXW6KtYZMWccLq6d8/6m0gA7OCr2ZMRJFU8M4f5yd/8AWK4AO7giRCeGWfIocc5q7d8P6mlwE9gdpduF8DWUULlHszlyT7deO/S65AiJJ0xu5tzymrpJjfMuVlzMck8bb4750mPIkrHmWNYXcZzmqFZcyxE+hOSbi4XVIElY8yw474OSeQifMkS5Fzm4mF1VY8yxQyGeO+NNck87QRLkSHyZvKbjGN1VVzLFC65HPjv06cs+wS5AdDpZuOcurtQyGMuuSOfHfOnTkn2B8gDrfLlPChdcij5l48jjx+9O3J5mwPkAdnFQuuRV8yY8jjx+Lp25PM2kkgHZxULx3SKvmyY8jjh4y07Z+cdpAB2cVGXjyKy5kx5M44eMtO2fnHaQAdnFR8y8eRWXMmPJnHDxlp2z847SADs4qPmCZcyDzXxXqx8wABFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMlKm5vL2iTSpN7y5HpeIrfZI78fFvzk/P/AOn/ALOv8cftlppKCS2Rhr3GMxp8+5gqVnJOMdo/5IpU5VHhcurGfJu9cF4P+eSfJzKxjKcsLLbPZRoKG8t5f4MlOnGmsR59WUrVlTWFvLsMcJhO2TPJz5c16cfpkqTjBZk8HirVpVNuUexjnKU5Zk8s9FG3z61T5GbllyXWLthxcf8Azztn7YqVGVTltHue2nTjTXqrfuW2iuiSPLWuOap/M3Jjxzd9uGWfJ/03rj6ZqtaNPnvLseOpVlUe727FYqU5YWW2eujbqO89326GN5cl8eneY8X/ADTd81gpUZVN+Ue7PZTpRpr1Vv3LNqKy2kjy1blvant4m9Y8fv24XLl/6bqenq9PGi8yfPojzV7upVyk+GPZHmSlOWFltnvtbNSSlVef4Ucssss74evjww4JrK7ryUqU6rxCOfHobChZQhvU9aXboeqMVCOEkkux5q97CnlQ9eX5CYzHzS8mefjF6dorokjyVr6EMqmuJ9+h4q1edV+vLbsuRNG2qVd4rEe7Jc7fEanDMfOdVq1qlV+vLbt0LULepWliEdu75Hvo2dOnvL15eJ6G1FZbSS7iYb9l5pj4xjFQ06nHDqtzfbkj2xjGCxFJLskeKtqNOKxTXG/yPBWuq1bKlLEey2RNyenTrll5ra1rujSynLil2jueGtqVSW1KKgu73Z5KVKpVeKcHI91HTW8OtPHhEm7fTXXHH28E6k6jzOTk/FmajaV6vswaXd7G2o21Kjhwgsrq92emU4xjxSkoru3gnX9anJ9RraWlr97U+EfqeylaUKXs01nu9zFW1GhD2czfgtjxVdSrS2gowXzY8RdZVvItKO7wkYat7b0/aqJvstznp1alR5qTlLzZelQq1fu6cpLvjYza6Y4+PLZ1NWgvu6cn4yeDzT1S4fs8MF4L6k0tLry9txgvPLPVT0mkvvJyl5bE8r4jW1LmvU9urNrtkxJNvZNs6OlZW0OVGLf8W/8Ak9EYxgsQiorslgaa25ylaXE/Zoz+KwemGl3MucYx85fQ3bkoLMmkvFlZ3ttDnWh8HkljUrWQ0ap+KrBeSyZo6ND8VaT8o4M09UtY8pSl5RMb1mivZp1H54RGl46PbrnOo/ivoZIaVarnGT85HklrXu0PnL/RR61V/DSgvNsixslplov3X/0/qXjp1pj7lfNmqesXHSFL5P6kf8xc9FT+RG5W4/460/6Y/mWWnWjX3MfmzS/8zdf/ANP+0mOs3KfKn/aRqWNw9Ms3+5X9z+pD0mzfKm15SZrFrVz7tJ/B/UstcrdaVP4ZMtSx7no1q+TqLykUlodL8NWa80mYI67L8VBPylj9DNDXKb9qjNeTTIs0xy0KX4K6fnHBilot1H2XTl5M2FPWbV8/SR84nop6laTxivFfzZX+SNTTQT067h7VCT/l3/weedOdN4qQlF/xLB2EKtOp93UhL+Vpl9msNbDa6cdSrVKTzTqTh/LJo9dLVbun+8412ksnQTs7ar7dCm33SweWrottP2HOHk8r8yNPNR16XKtRT8YvH5Hvo6vaVOc3TfaaNbV0KrHPoqsJeElhnjrWF1SWZ0ZNd47/AOCajUtdZSqwqLNOcZrvF5IrW9GssVacJ+LW5xkZShLMW4yXVPDPdQ1W7pfvPSLtNZ/PmZ01K2tfRKE96MpU325o11fSLqllxiqkf4Xv8j3W+u05bV6coPvHdGyt7qhcL7GrGT7Z3+RKrkWp054kpRku+zR77bVrqjhOfpI9p7/nzOjrUadaOKsIzXijW3GiUp5dCbpvs90RWW11qhUwqydKXjuvmbOE41IqUJKUX1Tycnc6dc2+XKnxQ96O6MFGvVoS4qVSUH4Mmmo6i60y2uMtw4J+9DY1F1o9xRy6X2sP4efyM1prko4jdQUl70dn8jc211RuY5o1FLuuq+BmtRyMJTo1MxcoTXbZo21nrdSGI3MfSR95bM3F1Z0Lpfa0037y2a+JpLzRatLMrd+lh25S/wBkVv7W6o3MM0ZqXddV8Cl5Y0LpP0sMT9+OzOSjKdGplOUJxfk0bey1uUcQuo8a9+PP5E0sYL3Sa9vmUPtafeK3XwPJb3FW3nx0ZuL8Ovmddb16VeHHRnGcfA817plC6zJL0dX3orn5ojUrBYazTq4hcpU5+9+F/Q2zjGpBqSUoSXJ7pnIXtjXtJfaRzHpNbpmSx1CvaNKL4qfWEuX+iWK2V/oq3nafGm3/AIZpmqlCrvxQqRfk0dVY39G8iuB8NTrB8y93Z0byGKsfWXKS5oitbp2tcqd55Kov1N5Fwqw24ZwkvNNHJ3+nVrNttcdLpNfr2IsL+tZy9R8VPrBvYlitnqOjc6ln5um/0NPTnUoVeKLlTqRfk0dZY3tG8hmnL1l7UXzRj1DT6V4sv1KvSa/UhKw6ZrEK+KdziFXkpdJfQ2s6NOupU6sVKLXU4y7tatpV4KscdmuT8jZaNq06E/R3Dc6WNn1j/o8//RP4rtwz+5pk1HTalq3OGZ0e/VeZhsL2rZzzB5g+cHyZ1UJwq01KLUoS6rdM02paTjNW0j50/p9D8x+rjnvxk21ndUrqkp0n5xfNHm1LTYXKc6eI1u/SXmc7b1qlvVU6cnGS/wD5hnS6dqFO7jj2aqW8foZLjcbuOZqU50puFSLjJc0yDqr+yp3lPEvVqL2ZnNXFCpb1HTqxw/yYdcc+zGiSpYy2kkqSiVVkSipKMKsiSESiCyJRVFjNEjkEGRqLIlFEy6MWCSSESuxFWJRVEoyLokqiyMKksiqJRKqwI6EmAAAAAAAAAAAAAAAAAAAAAGgAAAAAQAwRAAAAAVQAAAAAAAEEFiMFHyEAH058nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExeCxQtF9Drhl9Vy5MfuJJIB1cVWsMJ4ZZ7oocMp1u4743tNVkIIiyTtjdzbjZq6SUawywksoznjuNYZaqsXhliheLyjPHl9NcmP2EtZRAOtm3JQtFiS6lUcP8ZO/+8VwTzIO7gSWShkKNYZx5J9uvHfpZPIKxe+Cx0wu4xlNUKyWGWEllEzm4uF1VYvcsULp5Jx36a5J9gksoA6WbmnOXV2oXW6KtYZMX0OOF1dOuc7TaQAdnFWSwyYsTRVHC/wA5O8/rFcEkHdwRJbFVszI9zGceSau3bju5pkIEXsDrLubcrNXSWsmMuVlzOfJPt0479LJ5QIgSbwu4xlNUKvmWIkTkm4vHdUiSVWzLDju4ck1QiRIlyLnNxMLqqx5lihk6GeO/TXJPtAnyA6G8puaYl1dqLmXKF1yRz479OnJPsD5MA62bcp4UMnNGN8y0eRx47q6duTzNpJZAOzioXjyRWXMmHU44eMtO2fnHaQAdnFR8y8eRWXMmHM44+MtO2XnHaQAdnFV8yYESJhzOM8Zu184JAB2cVZcyYCREeZx9Zu3vBYAHZxVlzJh1E+hEeZx9Zu3vBYAHZxVnzJh1EiI8zjfGbtPOCwAOzirLmIky5IiPM43xm7TzgsADs4olzIiTLkRHmcb4zdp5wWAB2cUS5lS0+RU8+c8vRx/5AAZbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPRpfil8ETRpY9aXPsZZyUVlnp4+LX9ZPzP+n/qud+PiJSUVl8jy1Kjn4IVJub35di1Klxby5f5JlneS9cV4uHD/AJsfk5PaKVNzeeUT300lBKKwjFtFdkjz1KzeYxeI/wCTVmPFP/XLHPk/6s9fTPXuMZjT59zyxi5ywt2y1KnKpLC5dWe6nTjTWFz6s5THLku76ezLPD/mx64+1KFFU1l7y/wXqTjTjmTKVqyprC3l2PFKUpyy222byzmE1i48fDnz3vyXwvWrSqPtHsKNGVR55R7mWjb9anyPVtFb4SM48dy/rJ05P+jHjnTiVp0401iKK1q0ae3OXYw1rjPq09l3PPGMpyxFZbLlya8YM8f/ADXL++WpqVJVHmT+BejQlPDe0T0UbeMMOW8jLKSisyeETHi35zXk/wCqT+OKIp04wWIr4k/tMaLed2+iPLVuXLansu/UwRjKUsJNsZck/wA4nF/zZb78lZ69zUrbN4j2RFGhUrP1Ft3fI9drZxcVOq+J9uiPbtGPRJGJhb/p6bzYyaweehZ06eHL15ePI9EmoLMmkvE8le+jHakuJ9+h4KtWdV5nJsXKY+mZx5Z+cnurX0VtSXE+75Hhq1Z1Xmcm/Ay0bSpU3xwx7s99G1p0sPHFLuyayyb3hx+vbwW9rVrNcKwn1ZsqGn0oYc8zl48i8pqn60pJJdzBX1KC2ox4n3fIXGYrjnln6e9JRWEkkjz1r2jS24uKXaO5qa1xVre3N47LkRSoVaz+zg2u/Qz2/HScevb01tRqz2ppQXzZ5JTlUeZycn4s2FHTetafwie6jQpUcejgk+/Udbfa98cfTUUbKvU5QcV3lse2lpaX3tRvwibCdSEI8U5KK8WeSrqVGHscU34bImpGu1vpnpWlCn7NOOe73PTFrh32waOrqVaXscMF4LLPJOrUqPM5yl5slsXHG78uhqXlvT9qrFvstzy1NWpr7unKXm8GrpUKtX7unKXjg9VPS68va4YebyZ3XTUi0tVrv2FCC8smCpeXM/arT+Dx/g99PSaa+8qSl5LB66Wn2sUvs+J/xNsaqyxzzbby22/Ey0qFWfsUpy8os6WFKnT+7hGP8scF08Mmmtufjp11LlSa82kZY6Tcvn6OPmzdyr0o+1VprzkjFK/tY860fhuRpr46NUftVYLyTZkWi96/yh/s9D1W1j+KUvKJV6xbrlCo/gvqRVIaNDrWl8i60aj1qVPyKf8ANUlypT+aD1qP/S/7iNRmjo1Br7yr819CHolD/sqfkYlraX7h/wB3+iy1yP8A0S/uI3GX/hKTW1afyRV6Gulw15w/2I65TzvRn80ZFrdv1p1V8F9SNTTzy0Of4a0X5xwUei3K5TpS+L+hsI6xavm5rziZI6naS5VkvNNGfLU0009KvI/us+UkYZ2lxD2qFRePCzp4XdvP2a1N/wBSM8GnummvALI4zDWzTTM1O6r0vYrVI+ClsddKMZ7TipLxWTz1NPtKntUIL+Xb/BGtNJS1e7hjMozX8Ufoeylrv/bR+MX+hlq6Jby+7nOD+aPJU0StHPoqkJ+ezJ4WbbSjq1pU51HB9prB7aVSFRZpzjJd4vJyVawuqPt0Z47pZX5GCMpQlmLcZLqngmmtuzrW9GsvtaUJ+LW54K+iW88+ilKm/mjU0NVu6WM1ONdprP8As2NvrtN4VelKL7x3RmytSx46+j3VLLgo1V/C9/keCUZ0p4nGUJLo1hnX291QuPuasZPt1+Rkq0qdaPDVhGce0lkNOZttTuqGF6Tjj2nuba11ujPCrxdN91uitxotCpl0ZOnLtzRq7nTLmhluHHH3obkV1VGrCrFSpzjOPdPJgutOtrlNzgoz96OzOTpValGfFSnKEl1Twba01ypDCuYKovejszNiyq3ei1qWZUGqse3JmtXHSqfihOPwaOutbyhdL7Gom/dez+Ra4taNzHhrU1Ls+q+JNtNJZ61VpYjcL0se/KRvbS8o3Uc0ZpvrF80aS80SpDMraXHH3XszV4qUam/FTqRfk0TSuvurOhdRxVgm+kls18TR3ukVqGZUftYeC3XwLWWt1KeI3K9JD3l7S+pvba5pXMOKjNSXVdURY5GjWqW9TjpTlCS7G9sNajPELpKEvfXJ+Z677TqF2m5Lgqe/H9e5z97p9e0eZx4qfSceRGo631KkPwzhJeaZqL7RoyzO0fDL3Hy+BqbG/rWkvs5Zh1g+R0dhqNG7SUXw1OsHz+Hcy05iUalCriSlCpF+TRuNO1lxap3e65ekX6m1vLSjdwxVjv0kuaOd1DTa1o3LHHS6SXTzCurjKFWmnFxnCS80zTajoyadS02fN0/oaqwv61nLMHmD5wfJnT2N7RvIZpvE17UHzRkcpCVShVzFyp1IvyaOh0zV4VsU7nEKnJS6S+h6NQ0+leRba4avSa/U5q7tatrV4K0cdmuT8iNe3YV6NO4pOnVipRZz15ptS0qucMzo49rqvMnS9WlQxTuG50uSfWP+jpbecKvrQalCUefNM4c/+K68F1yRzlhfVLOeYvipvnB8mdNaXNO6pKdJ5XVdUafU9J4U6tqm1zcO3kau2uKltV46UsPquj8z8x+tZM/MdBqemRuc1KOI1uvaRoPtKFX8UKkH5NM6bT76neU9vVqr2ofqhqFhTvIZ2jVXKX6MymOVnisOl6nG5xSrYjW6PpL/AGey8tqd1S4Ki8n1TOUrUqlvWcKicZo3el6n6Tho3LxPlGffz8SVcsdecWqvLWpa1eCotukujRgR11xQp3FJ06qyny7o5q+s6lpV4Zbwfsy7kbwz7eK85JAI6LEohAxWlkSipZEFkWXYoiUZosiSOpKMqjky6KsJkqrokhEowLdSUVXJkoirolFUWMWKkkhEoyqyJKokzRIAIAAAAAAAAAAAAAAAAAANQAAAAAAgkhgAARAAAAAVQAAAAAABR8gAB9OfJwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKyLdZIAPVHkCJoAxyem+P8A0qZGAZ4vtrlQADq5KvmI8wDz/wD09H/ysAD0POnBjAOXJ9O3F9rR5MkA3h/lzz/0ET5ADP0Ye1TIAY42+T6QADq5KPmWj1AOGP8Ap3z/AMpAB3cETKrmAcM/9O+H+VwAd3BPRmMA5cjtxfa8eQAOmPpyy90Ky5gGOT03x+0w5kgF4/Scn+giQBc/SYf6QuaLAGeL01yewS9kA3l6YntQv0AOfE68v0DoAdXFQvHkgDjx+3fl9AAOzgq+bJjyYBxw/wBO2f8AlIAOzirLmTEA4z/btf8ACQAdnFE+ZEeYBx/+3b/4WAB2cUTIjzAON/27T/CwAOziiZC5gHHL/Ttj/lYAHZxRLkVXNAHHP/Tth/lcAHZxJ8iq5oA45/6dsP8AKwAOziSKrmgDjn/p2w/ysADs4kuRVc0Acc/9O2H+VgAdnElyKrmgDjn/AKdsP8rAA7OKJ8ioBw5PbvxegAGHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADNbRTbb5oA6cX+o83/AGWziunpPFUk5SeQDtz+o8P/APr5O9WoRUp79D1AF4P8s/8Afb8mnnuJNz4eiMUVmSQBw5POb3/881wzX42cYqMcRWEY7mbhTzHm9gDvl4xung4v65Jv9eHnzPXaQjwceMyAPPxf6fpf9ds4/D0HhuKkpTlFvZPkAdeb08n/AByXPyxpZkl3ZsKcIwWIrABng+3X/ut1ItJ4i32NdUnKbzJ5ALzX0n/DJu0pxUpxi+TZsIQjBYisIAnDPZ/3W+Iz0G05LpjJrritOrJqT2XRcgCc3tv/AI5uMJtLS3pxpxnw5k98voAc+P29PPdYvSYLyrKlS4oYznG4B2y9PLj7jVznKpLM5NvxIQB5q/QnhuLKzo+ijOUeKTWdz2rZbAHSenDO+UmpvbytGrKnBqKXVLcAmXpeObrxOUpvMm2+7eQAc3qj1afbQuJPjctuzNtTtaFL2Kcc93uAaxc869ceRIBGp6DWXeoVqM3GCh5tAErU9vFO/uZ86rX8uxgnUnU9ucpebyAYdER5EgBuBYAlAR5IAixIQBGoFwCVYkABoReMpReYyafgwDNaeinfXVP2a9T4vP8Ak9tvq91xxjPgnnq4/QAjcb+jNzpxk8ZfYyLmARuLGOtb0a2fS0oS8WtwCVpqdT023oUJVKXFFrpnKNIABKPbbaldUGkqjlH3Z7gGVdRb1HUownLGWs7GYAzW481zY29zl1aa4veWzOWuaapXE6cW2ovCyAFUi2mmm0+6N5ol/cVbhUKsuOOG8vn8wCLG+MVza0bmPDWgpdn1XxAMNOTu6UaNzUpxbcYvCzzK0qk6U1OnJxkuqYBVjqtIual1acdXHEnjKWMntwmsNZT6AGFc9rlnRt5QnRjw8b3iuRq02mmm011ADcdNoN3VuaU41pcTg8J9TaYTTTWUwDNPtzWuWtK2rwdGPCprLXReRr6c5U5qdOTjJcmgA06/S687myhUqY43s8GevQp3FJ06sVKL/IAzUcdcQVK4qQjnEZNLJsf/AB+5q0r2FKMvs57OL5AHH/o/xXfh/wBx16NH/wCQW1OnwVoR4ZyeJY5MA/LfpYe2opzlSqKdOTjJcmjrrCrKta0qk8cUll4AJXTk9Ri1a3p1rScpx9aEW4tc0cuAReP06PQ7ipWtpKo+JweE+uD316MLilKnVjmL/IAyxl4ycjNcM5Jck8EAEemJRIBmqlEoAyqSyAILLkEAZVIXMAixZFkAYAnqAZqrFkAZolEoAwsWJQBKqQAZAAAAAAAAAAAAAAAAAAFgAAoAAAGABAAIgAAAAKoAAAAAAAo//9k=`


}
