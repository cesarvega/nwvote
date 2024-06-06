import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import {
  Document, Packer, Paragraph, TextRun, ImageRun, HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
  AlignmentType,
  File, HeadingLevel, StyleLevel, TableOfContents, Table, TableCell, TableRow, WidthType, BorderStyle, HeightRule, VerticalAlign, Footer, PageNumber, ShadingType, Tab, convertInchesToTwip
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
  firstload = true;
  dsiLogo;
  reportTheme;

  constructor(private dragulaService: DragulaService, private _BmxService: BmxService, private http: HttpClient) { }
  ngOnInit(): any {
    this.firstload = true;
    this.user = [];
    this.projectList = [];
    const fs = require('fs');
    this.selection = new SelectionModel<any>(true, []);
    this._BmxService.currentprojectData$.subscribe((projectData) => {
      this.data = projectData !== '' ? projectData : this.projectId;
    });


    this._BmxService.currentProjectName$.subscribe((projectName) => {
      this.projectId = projectName !== '' ? projectName : this.projectId;
      localStorage.setItem('projectName', this.projectId);

      this._BmxService.getSelectedProjects().subscribe((projects: any) => {
        if (projects && !this.firstload) {
          this.projectList = this.projectList.concat(projects);
          this.mergeData(this.projectList);
        }
      });
    });
    this.projectList = [];
    this.projectList.push(this.projectId);
    this.mergeData(this.projectList);
    this.firstload = false;
  }

  mergeData(t: any) {
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

            }
          }
        });
    }
    this.changeView();
  }

  async createDataObject(t: any): Promise<any> {
    var done = [];
    this.total = 0;
    this.completed = 0;
    this.companyLogo = await this.imageToBuffer(this.companyLogo);
    this.biLogo = await this.imageToBuffer('https://tools.brandinstitute.com/bmresources/brandInstituteAssets/bi-logo-with-tagline.PNG');
    this.dsiLogo = await this.imageToBuffer('https://tools.brandinstitute.com/bmresources/brandInstituteAssets/DSI_logo.PNG');
    this.reportTheme = await this.imageToBuffer('https://tools.brandinstitute.com/bmresources/brandInstituteAssets/rx-blob-report3.PNG');
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
                if (r[y].nameCandidates != null) {
                  if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                    this.design = true;
                    answMC.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                  }
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
                  if (r[y].nameCandidates != null) {
                    if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                      this.design = true;
                      answCR.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                    }
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
                  if (r[y].nameCandidates != null) {
                    if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                      this.design = true;
                      answRT.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                    }
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
                  if (r[y].nameCandidates != null) {
                    if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                      this.design = true;
                      answCR.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                    }
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
                  if (r[y].nameCandidates != null) {
                    if (r[y].nameCandidates.includes("tools.brandinstitute")) {
                      this.design = true;
                      answRT.nameCandidate = await this.imageToBuffer(r[y].nameCandidates);
                    }
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
          verticalAlign: VerticalAlign.CENTER,
          width: {
            size: size,
            type: WidthType.PERCENTAGE,
          },
          shading: {
            fill: "1C3874",
            type: ShadingType.CLEAR,
            color: "auto",
          },
          borders: {
            top: {
              style: BorderStyle.NIL,
            },
            bottom: {
              style: BorderStyle.NIL,
            },
            left: {
              style: BorderStyle.NIL,
            },
            right: {
              style: BorderStyle.NIL,
            },
          },
          children: [new Paragraph({
            spacing: {
              before: 0,
              after: 0,
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
                        name: "Open Sans",
                      },
                      color: "FFFFFF",
                      size: 22,
                    }
                  ),
              ]
          })],
        }),
      )
    }
    return new TableRow({
      tableHeader: true,
      height: {
        value: 442.8571,
        rule: HeightRule.ATLEAST
      },
      children: arr,
    });

  }

  createTable(): Table {

    let row: Array<TableRow>;
    row = [];

    var shade;

    row.push(
      this.createHeader(["Name", "Email", "Status"], "receptHeader")
    );

    for (var i = 0; i < this.user.length; i++) {
      if (i % 2 == 0) {
        shade = ShadingType.CLEAR;
      }
      else {
        shade = ShadingType.NIL;
      }



      row.push(new TableRow
        (
          {
            height: {
              value: 500,
              rule: HeightRule.ATLEAST
            },
            children: [
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                borders: {
                  top: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  left: {
                    style: BorderStyle.NIL,
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                }, shading: {
                  fill: "EDEDED",
                  type: shade,
                  color: "auto",
                },
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  spacing: {
                    before: 0,
                    after: 0,
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
                              name: "Open Sans",
                            },
                            color: "000000",
                            size: 20,
                          }
                        ),
                    ]
                })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                borders: {
                  top: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  left: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                },
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                shading: {
                  fill: "EDEDED",
                  type: shade,
                  color: "auto",
                },
                children: [new Paragraph({
                  spacing: {
                    before: 0,
                    after: 0,
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
                              name: "Open Sans",
                            },
                            color: "000000",
                            size: 20,
                          }
                        ),
                    ]
                })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                borders: {
                  top: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  left: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  right: {
                    style: BorderStyle.NIL
                  },
                },
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                shading: {
                  fill: "EDEDED",
                  type: shade,
                  color: "auto",
                },
                children: [new Paragraph({
                  spacing: {
                    before: 0,
                    after: 0,
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
                              name: "Open Sans",
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
    var shade;
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
      if (i % 2 == 0) {
        shade = ShadingType.CLEAR;
      }
      else {
        shade = ShadingType.NIL;
      }

      if (!this.design) {
        row.push(new TableRow
          (

            {
              height: {
                value: 500,
                rule: HeightRule.ATLEAST
              },
              children: [
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    left: {
                      style: BorderStyle.NIL,
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                                name: "Opens Sans",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9"
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 40,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                                name: "Open Sans",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9"
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 40,
                    type: WidthType.PERCENTAGE,
                  },
                  margins:
                  {
                    left: 0,
                    right: 0
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                                name: "Open Sans",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    right: {
                      style: BorderStyle.NIL,
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },

                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                                name: "Open Sans",
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
              height: {
                value: 500,
                rule: HeightRule.ATLEAST
              },
              children: [
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    left: {
                      style: BorderStyle.NIL,
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                                name: "Open Sans",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    left: {
                      style: BorderStyle.NIL,
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    left: {
                      style: BorderStyle.NIL,
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },

                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                                name: "Open Sans",
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
    var shade;
    var overall = this.sortMultipleChoice(pagesPring);
    let row: Array<TableRow>;
    row = [];


    row.push(
      this.createHeader(["Question", "Scores",], "hello")
    )
    for (var i = 0; i < overall.length; i++) {
      if (i % 2 == 0) {
        shade = ShadingType.CLEAR;
      }
      else {
        shade = ShadingType.NIL;
      }
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
                    name: "Open Sans",
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
                    name: "Open Sans",
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
                verticalAlign: VerticalAlign.CENTER,
                borders: {
                  top: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  left: {
                    style: BorderStyle.NIL,
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                }, shading: {
                  fill: "EDEDED",
                  type: shade,
                  color: "auto",
                },
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  spacing: {
                    before: 0,
                    after: 0,
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
                              name: "Open Sans",
                            },
                            color: "000000",
                            size: 20,
                          }
                        ),
                    ]
                })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                borders: {
                  top: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                  left: {
                    style: BorderStyle.NIL,
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: .5,
                    color: "C9C9C9",
                  },
                }, shading: {
                  fill: "EDEDED",
                  type: shade,
                  color: "auto",
                },
                width: {
                  size: 33,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  spacing: {

                    before: 0,
                    after: 0,
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
        if (pagesPring != null) {
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
    var shade;

    row.push(
      this.createHeader(["Name", "Rationale", "Comments"], "byComment")
    )
    for (var i = 0; i < overall.length; i++) {
      if (i % 2 == 0) {
        shade = ShadingType.CLEAR;
      }
      else {
        shade = ShadingType.NIL;
      }
      a = [];
      for (var j = 0; j < overall[i][1].length; j++) {
        var w = overall[i][1][j].comment
        a.push(new TextRun
          (
            {
              text: overall[i][1][j].comment,
              font:
              {
                name: "Open Sans",
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
                name: "Open Sans",
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
                name: "Open Sans",
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
                name: "Open Sans",
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
              height: {
                value: 500,
                rule: HeightRule.ATLEAST
              },
              children: [
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    left: {
                      style: BorderStyle.NIL,
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                                name: "Open Sans",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
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
                      before: 0,
                      after: 0,
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
                                name: "Open Sans",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                  })],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    right: {
                      style: BorderStyle.NIL,
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
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
                      before: 0,
                      after: 0,
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
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    left: {
                      style: BorderStyle.NIL,
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
                  verticalAlign: VerticalAlign.CENTER,
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                    right: {
                      style: BorderStyle.NIL,
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: .5,
                      color: "C9C9C9",
                    },
                  }, shading: {
                    fill: "EDEDED",
                    type: shade,
                    color: "auto",
                  },
                  width: {
                    size: 33,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph({
                    spacing: {
                      before: 0,
                      after: 0,
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
        if (pagesPring != null) {

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
          }
          else if (y.questyonType === 'criteria') {
            for (var k = 0; k < y.answers.length; k++) {
              var combinedStr = y.answers[k].nameCandidate + "*" + y.answers[k].rationale;
              if (rankings.has(combinedStr)) {
                rankings.set(combinedStr, (rankings.get(combinedStr) + y.answers[k].score[0].RATE + y.answers[k].score[1].RATE));
              }
              else {
                console.log(y)
                rankings.set(combinedStr, (y.answers[k].score[0]?.RATE + y.answers[k].score[1]?.RATE));
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
        if (pagesPring != null) {
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
    }
    var test = Array.from(comments);
    return test;
  }

  byPage(pagesPring: any): Table {
    var overall = this.answerBYPage(pagesPring);
    let row: Array<TableRow>;
    var shade;
    var onShader = true;
    row = [];
    row.push(
      this.createHeader(["Page", this.nameTyping, "Rationale", "Answer",], "byPage")
    )
    var skip = false;
    for (var i = 0; i < overall.length; i++) {
      for (var j = 0; j < overall[i].question.length; j++) {
        if (onShader) {
          shade = ShadingType.CLEAR;
          onShader = false;
        }
        else {
          shade = ShadingType.NIL;
          onShader = true;
        }

        let textRow = [];
        if (j === 0) {
          textRow.push(
            new TextRun
              (
                {

                  text: overall[i].page.toString(),
                  font:
                  {
                    name: "Open Sans",
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
                    name: "Open Sans",
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
                      name: "Open Sans",
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
                      name: "Open Sans",
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
                      text: "[" + overall[i].question[j].resp[k].name + "]" + " " + overall[i].question[j].resp[k].value[0]?.RATE.toString() + " " + overall[i].question[j].resp[k].value[1]?.RATE.toString(),
                      font:
                      {
                        name: "Open Sans",
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
                      name: "Open Sans",
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
                height: {
                  value: 500,
                  rule: HeightRule.ATLEAST
                },

                children: [
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    borders: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      bottom: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      left: {
                        style: BorderStyle.NIL,
                      },
                      right: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                    }, shading: {
                      fill: "EDEDED",
                      type: shade,
                      color: "auto",
                    },
                    width: {
                      size: 10,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 0,
                        after: 0,
                      },
                      alignment: AlignmentType.CENTER,
                      children: textRow

                    })],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    borders: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      bottom: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      left: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      right: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                    }, shading: {
                      fill: "EDEDED",
                      type: shade,
                      color: "auto",
                    },
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 0,
                        after: 0,
                      },
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun
                          (
                            {
                              text: overall[i].question[j].question.split("*")[0],
                              font:
                              {
                                name: "Open Sans",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                    })],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    borders: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      bottom: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      right: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      left: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                    }, shading: {
                      fill: "EDEDED",
                      type: shade,
                      color: "auto",
                    },
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
                        before: 0,
                        after: 0,
                      },
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun
                          (
                            {
                              text: overall[i].question[j].question.split("*")[1],
                              font:
                              {
                                name: "Open Sans",
                              },
                              color: "000000",
                              size: 20,
                            }
                          ),
                      ]
                    })],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    borders: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      bottom: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      right: {
                        style: BorderStyle.NIL,
                      },
                      left: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                    }, shading: {
                      fill: "EDEDED",
                      type: shade,
                      color: "auto",
                    },
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 0,
                        after: 0,
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
                height: {
                  value: 500,
                  rule: HeightRule.ATLEAST
                },
                children: [
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    borders: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      bottom: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      left: {
                        style: BorderStyle.NIL,
                      },
                      right: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                    }, shading: {
                      fill: "EDEDED",
                      type: shade,
                      color: "auto",
                    },
                    width: {
                      size: 33,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 0,
                        after: 0,
                      },
                      alignment: AlignmentType.CENTER,
                      children: textRow

                    })],
                  }),
                  new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    borders: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      bottom: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      left: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      right: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                    }, shading: {
                      fill: "EDEDED",
                      type: shade,
                      color: "auto",
                    },
                    width: {
                      size: 33,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 0,
                        after: 0,
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
                    verticalAlign: VerticalAlign.CENTER,
                    borders: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      bottom: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                      right: {
                        style: BorderStyle.NIL,
                      },
                      left: {
                        style: BorderStyle.SINGLE,
                        size: .5,
                        color: "C9C9C9",
                      },
                    }, shading: {
                      fill: "EDEDED",
                      type: shade,
                      color: "auto",
                    },
                    width: {
                      size: 33,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      spacing: {
                        before: 0,
                        after: 0,
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
        if (pagesPring != null) {

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
    var onShader = true;
    var shade;
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
        this.createHeader(["Name", this.nameTyping, "Rationale", overall[0][1][0].score[0]?.name, overall[0][1][0].score[1]?.name], "criteria")
      )
    }
    else if (this.reportType === "vote") {
      row.push(
        this.createHeader(["Name", this.nameTyping, "Rationale", "Answer",], "byRespondants")
      )
    }
    for (var i = 0; i < overall.length; i++) {


      for (var j = 0; j < overall[i][1].length; j++) {
        if (onShader == true) {
          shade = ShadingType.CLEAR;
          onShader = false;
        }
        else {
          shade = ShadingType.NIL;
          onShader = true;
        }

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
                    name: "Open Sans",
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
                    name: "Open Sans",
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
          verticalAlign: VerticalAlign.CENTER,
          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: .5,
              color: "C9C9C9",
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: .5,
              color: "C9C9C9",
            },
            left: {
              style: BorderStyle.NIL,
            },
            right: {
              style: BorderStyle.SINGLE,
              size: .5,
              color: "C9C9C9",
            },
          }, shading: {
            fill: "EDEDED",
            type: shade,
            color: "auto",
          },
          width: {
            size: 30,
            type: WidthType.PERCENTAGE,
          },
          children: [new Paragraph({
            spacing: {
              before: 0,
              after: 0,
            },
            alignment: AlignmentType.CENTER,
            children: textRow
          })],
        }))

        if (!this.design) {
          cell.push(new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              left: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              right: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
            }, shading: {
              fill: "EDEDED",
              type: shade,
              color: "auto",
            },
            width: {
              size: 30,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({
              spacing: {
                before: 0,
                after: 0,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].question.split("*")[0],
                      font:
                      {
                        name: "Open Sans",
                      },
                      color: "000000",
                      size: 20,
                    }
                  ),
              ]
            })],
          }));
          cell.push(new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              left: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              right: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
            }, shading: {
              fill: "EDEDED",
              type: shade,
              color: "auto",
            },
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
                before: 0,
                after: 0,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].question.split("*")[1],
                      font:
                      {
                        name: "Open Sans",
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
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              left: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              right: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
            }, shading: {
              fill: "EDEDED",
              type: shade,
              color: "auto",
            },
            width: {
              size: 33,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({
              spacing: {
                before: 0,
                after: 0,
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
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              left: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              right: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
            }, shading: {
              fill: "EDEDED",
              type: shade,
              color: "auto",
            },
            children: [new Paragraph({
              spacing: {
                before: 0,
                after: 0,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].score[0].RATE,
                      font:
                      {
                        name: "Open Sans",
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
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              left: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              right: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
            }, shading: {
              fill: "EDEDED",
              type: shade,
              color: "auto",
            },
            children: [new Paragraph({

              spacing: {
                before: 0,
                after: 0,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].score[1]?.RATE,
                      font:
                      {
                        name: "Open Sans",
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
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              left: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              right: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
            }, shading: {
              fill: "EDEDED",
              type: shade,
              color: "auto",
            },
            width: {
              size: 10,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({
              spacing: {
                before: 0,
                after: 0,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: state,
                      font:
                      {
                        name: "Open Sans",
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
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              bottom: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              left: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
              right: {
                style: BorderStyle.SINGLE,
                size: .5,
                color: "C9C9C9",
              },
            }, shading: {
              fill: "EDEDED",
              type: shade,
              color: "auto",
            },
            width: {
              size: 10,
              type: WidthType.PERCENTAGE,
            },
            children: [new Paragraph({
              spacing: {
                before: 0,
                after: 0,
              },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun
                  (
                    {
                      text: overall[i][1][j].score,
                      font:
                      {
                        name: "Open Sans",
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
              height: {
                value: 500,
                rule: HeightRule.ATLEAST
              },
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
          if (pagesPring != null) {

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
    if (testname != null) {

      if (testname.includes('<span')) {
        return testname.substring(
          testname.indexOf(">") + 1,
          testname.lastIndexOf("</")
        );
      }
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

    const currentDate: Date = new Date();
    const formatter2 = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
    const formattedDate2: string = formatter2.format(currentDate);

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
            text: "Contact Person – " + this.data.bmxRegion,
            font:
            {
              name: "Open Sans",
            },
            size: 22,
          }
        ),
      new TextRun
        (
          {
            text: this.data.bmxRegionalOffice[0].name,
            bold: true,
            font: {
              name: "Open Sans",
            },
            size: 22,
            break: 1
          }
        ),
      new TextRun({
        text: this.data.bmxRegionalOffice[0].title,
        font: {
          name: "Open Sans",
        },
        size: 22,
        color: "7F7F7F",
        break: 1
      }),
      new TextRun({
        text: "P ",
        bold: true,
        font: {
          name: "Open Sans",
        },
        size: 22,
        break: 1
      }),
      new TextRun({
        text: this.data.bmxRegionalOffice[0].phone.trim(),
        font: {
          name: "Open Sans",
        },
        size: 22,
      }),
      new TextRun({
        text: "E ",
        bold: true,
        font: {
          name: "Open Sans",
        },
        size: 22,
        break: 1
      }),
      new TextRun({
        text: this.data.bmxRegionalOffice[0].email,
        font: {
          name: "Open Sans",
        },
        size: 22,
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
          new TextRun({
            break: 1,
            font: {
              name: "Open Sans",
            },
            size: 22,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new ImageRun({
            data: Buffer.from(this.biLogo, "base64"),
            transformation: {
              width: 152.64,
              height: 109.6154,
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
            data: Buffer.from(this.dsiLogo, "base64"),
            transformation: {
              width: 203.52,
              height: 106.7308,
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
            break: 1,
            size: 22
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
            size: 22
          }),
          new TextRun({
            text: "",
            bold: true,
            font: {
              name: "Open Sans",
            },
            size: 22,
          }),
        ],
      }),
      new Table({
        width: {
          size: 95,
          type: WidthType.PERCENTAGE,
        },
        margins: {
          right: convertInchesToTwip(0.08),
          left: convertInchesToTwip(0.08),
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
                                  text: "Brand Institute, Inc.",
                                  bold: true,
                                  font:
                                  {
                                    name: "Open Sans",
                                  },
                                  size: 22,
                                }
                              ),
                            new TextRun
                              (
                                {
                                  text: "200 SE 1ST STREET – 12TH FL",
                                  font: {
                                    name: "Open Sans",
                                  },
                                  size: 22,
                                  break: 1
                                }
                              ),
                            new TextRun({
                              text: "Miami, FL 33131",
                              font: {
                                name: "Open Sans",
                              },
                              size: 22,
                              break: 1
                            }),
                            new TextRun({
                              text: "P ",
                              bold: true,
                              font: {
                                name: "Open Sans",
                              },
                              size: 20,
                              break: 1,
                            }),
                            new TextRun({
                              text: "305 374 2500",
                              font: {
                                name: "Open Sans",
                              },
                              size: 22,
                            }),
                            new TextRun({
                              text: "E ",
                              bold: true,
                              font: {
                                name: "Open Sans",
                              },
                              size: 22,
                              break: 1,
                            }),
                            new TextRun({
                              text: "info@brandinstitute.com",
                              font: {
                                name: "Open Sans",
                              },
                              size: 22,
                              style: "Hyperlink",
                            }),
                            new TextRun({
                              text: "",
                              break: 1,
                              size: 22,
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
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: "",
            break: 5,
            size: 20,
          }),
          new TextRun({
            text: "BRANDMATRIX",

            bold: true,
            font: {
              name: "Montserrat",
            },
            size: 60,
          }),
          new TextRun({
            text: "TM",
            superScript: true,
            font: {
              name: "Montserrat",
            },
            size: 52,
          }),
          new TextRun({
            text: "",
            break: 1,
            size: 20,
          }),
          new TextRun({
            text: "Report",
            bold: true,
            font: {
              name: "Montserrat SemiBold",
            },
            size: 48,
          }),
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new ImageRun({
            data: Buffer.from(this.reportTheme, "base64"),
            transformation: {
              width: 249.6,
              height: 252.8846,
            },
            floating: {
              horizontalPosition: {
                relative: HorizontalPositionRelativeFrom.MARGIN,
                align: HorizontalPositionAlign.RIGHT,
              },
              verticalPosition: {
                relative: VerticalPositionRelativeFrom.PAGE,
                align: VerticalPositionAlign.CENTER,
              },
            },
          }),
        ]
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
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: Buffer.from(this.companyLogo, "base64"),
            transformation: {
              width: 299.5200,
              height: 120.1923,
            },
          }),
          new TextRun({
            text: "",
            break: 1,
            size: 20,
          }),
          new TextRun({
            text: "PROJECT NAME: " + this.projectName,
            size: 36,
            color: "1C3874",
            bold: true,
            font: {
              name: "Montserrat",
            },
          }),
          new TextRun({
            text: "",
            break: 1,
            size: 20,
          }),
          new TextRun({
            text: "Report Date: ",
            size: 22,
            bold: true,
            font: {
              name: "Open Sans",
            },
          }),
          new TextRun({
            text: formattedDate2,
            size: 22,
            font: {
              name: "Open Sans",
            },
          }),
        ]
      }),
      new Paragraph({
        pageBreakBefore: true,
      }),
      new Paragraph({
        text: "TABLE OF CONTENTS",
        style: "MySpectacularStyle",
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
                name: "Open Sans",
              },
              size: 22,
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
                  name: "Open Sans",
                },
                size: 22,
              }),
              new TextRun({
                text: "TM",
                superScript: true,
                font:
                {
                  name: "Open Sans",
                },
                size: 22,
              }),
              new TextRun({
                text: " COMPLETION STATUS",
                font:
                {
                  name: "Open Sans",
                },
                size: 22,
              }),
              new TextRun({
                break: 1.5
              }),
              new TextRun({
                text: "Percentage of participants who have completed the BrandMatrix",
                font:
                {
                  name: "Open Sans",
                },
                size: 22,
              }),
              new TextRun({
                text: "TM",
                superScript: true,
                font:
                {
                  name: "Open Sans",
                },
                size: 22,
              }),
              new TextRun({
                text: "TM = " + ((this.completed / this.total) * 100).toFixed(2).toString() + "%",
                font:
                {
                  name: "Open Sans",
                },
                size: 22,
              }),
              new TextRun({
                break: 1.5
              }),
              new TextRun({
                text: "(" + this.completed + " out of " + this.total + ")",
                font:
                {
                  name: "Open Sans",
                },
                bold: true,
                size: 22,
              }),
            ],
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
                  name: "Open Sans",
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
                    name: "Open Sans",
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
                  name: "Open Sans",
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
                  name: "Open Sans",
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
              color: "1C3874",
              font:
              {
                name: "Montserrat",
              },
              size: 36,
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
              font: 'Open Sans',
              bold: true,
              color: '#1C205C',
              size: 20
            },
          }

        ],
      },

      sections: [
        {
          properties: {
            titlePage: true,
            page: {
              margin: {
                top: 800,
                right: 1042.8571
              }
            },
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      size: 20,

                    }),
                    new TextRun({
                      text: "",
                      break: 1,
                    }),
                    new TextRun({
                      text: "Project: ",
                      italics: true,
                      font: {
                        name: "Open Sans",
                      },
                      size: 20,
                    }),
                    new TextRun({
                      text: this.projectName.trim(),
                      bold: true,
                      italics: true,
                      size: 20
                    }),
                    new TextRun({
                      text: "   |   " + new Date().getFullYear(),
                      size: 22,
                      font: {
                        name: "Open Sans",
                      },
                    }),
                    new TextRun({
                      text: "© Brand Institute, Inc.",
                      bold: true,
                      font: {
                        name: "Open Sans",
                      },
                      size: 20,
                    }),]
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

}
