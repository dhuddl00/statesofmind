package com.statesofmind

class OrderPayment {

    Date paymentDate
    String method
    Double amt
    String notes

    static constraints = {
    }
 
    static belongsTo = [ order: Order ]
}
