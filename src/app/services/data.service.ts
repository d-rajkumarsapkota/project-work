import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { } 
  
  public ADMIN = 'Admin'; //used in edit-employee.ts

  facilities = [
    { id: 1, name: "Offices & warehouses"},
    { id: 2, name: "Building Towers"},
    { id: 3, name: "Super Markets"},
    { id: 4, name: "Childcare centers"},
    { id: 5, name: "Community centers"},
    { id: 6, name: "Hospitals"},
    { id: 7, name: "Age care centers"},
    { id: 8, name: "Medical centers"},
    { id: 9, name: "Schools"},
    { id: 10, name: "Kindergartens"},
    { id: 11, name: "Car Parks"},
    { id: 12, name: "Night Clubs & Pubs"},
    { id: 13, name: "Play ground Centers"},
    { id: 14, name: "Cinemas"},
    { id: 15, name: "Construction sites (Building)"},
    { id: 16, name: "Resturents & commercial kithens"},
  ];

  feqOfServices = [
    { id: 51, feqOf: "7 days a week"},
    { id: 52, feqOf: "6 days a week"},
    { id: 53, feqOf: "5 days a week"},
    { id: 54, feqOf: "4 days a week"},
    { id: 55, feqOf: "3 days a week"},
    { id: 56, feqOf: "2 days a week"},
    { id: 57, feqOf: "1 day a week"},
    { id: 58, feqOf: "One off cleaning"},
  ];

  listOfAreas = [
    { id: 100, area: "Less than 1000"},
    { id: 101, area: "Less than 2000"},
    { id: 102, area: "Less than 3000"},
    { id: 103, area: "more than 4000"},      
  ];

  noOfShowers = [
    { id: 200, shower: "No showers"},
    { id: 201, shower: "<5 showers"},
    { id: 202, shower: "<10 showers"},
    { id: 203, shower: ">15 showers"},
  ];

  noOfToilets = [
    { id: 150, toilet: "No toilets"},
    { id: 151, toilet: "<5 toilets"},
    { id: 152, toilet: "<10 toilets"},
    { id: 153, toilet: ">15 toilets"},
  ];

  modalLists = {
     'modalFreq': false,
     'modalArea': false,
     'modalShower': false,
     'modalToilet': false,
     'modalContact': false 
  };

  selectedQuotationValueObj = {
     'selectedFacility': ''  ,
     'selectedFrequency': '',
     'selectedArea': ''  ,
     'selectedShower': ''  ,
     'selectedToilet': ''  ,
  };

  contactDetailsObj = {
     'username': '' ,
     'email': '' ,
     'contactNumber': '' ,
     'siteLocation': '' ,
  }

  toast = {
    true: {
      'bg': 'bg-success',
      'icon': 'fa fa-check',
      'titleText': 'Success',
      'bodyText': 'Quote requested successfully!'
    },
    false: {
      'bg': 'bg-danger',
      'icon': 'fa fa-times',
      'titleText': 'Unsuccessful',
      'bodyText': 'Something went wrong, try again later'
    }
  }

  employeeTypeCategory = [
    'Site Manager',
    'Asst Manager',
    'Team Leader',
    'Head Cleaner',
    'Cleaner'
  ]

  states = [
    'New South Wales',
    'Queensland',
    'Northern Territory',
    'Western Australia',
    'South Australia',
    'Victoria',
    'Australian Capital Territory',
    'Tasmania'
  ]

  userVerifyStatus = {
    'active': {
      'header' : 'Account already verified!',
      'body' : 'Your email has been already verified.'
    },
    'activated' : {
      'header' : 'Account verified!',
      'body' : 'Thank you, your email has been verified. Your account is now active.'
    }
  }
  
}
