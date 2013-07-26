package com.statesofmind

class Client {
    
    String companyName
    String address1
    String address2
    String city
    String state
    String zip
    String contactName
    String contactPhone
    String contactEmail
    String sensitive

    static constraints = {
        companyName unique: true, blank: false
        city blank: false
        state size:2..2, blank: false
        contactName blank: false
        contactEmail email: true
    }

    static hasMany = [ orders : Order ]

}
