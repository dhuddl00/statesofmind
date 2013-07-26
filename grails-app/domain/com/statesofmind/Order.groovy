package com.statesofmind

class Order {

    String desc
    String notes
    Date orderDate
    Integer numOfDesigns
    Double amount 
    Date plannedCompleteDate
    Date actualCompleteDate
    boolean blanksOrdered
    boolean sentToPrinter
    boolean shipped
    boolean completed

    static constraints = {
        plannedCompleteDate nullable: true
        actualCompleteDate nullable: true
    }
    
    static belongsTo = [ client: Client ]
    static hasMany = [ payments : OrderPayment, expenses : OrderExpense ]

    static mapping = {
        table 'client_order'
    }

}
