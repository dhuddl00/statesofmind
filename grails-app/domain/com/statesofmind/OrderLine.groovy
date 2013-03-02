package com.statesofmind

class OrderLine {

    Design design
    Style style
    Color color
    Size size
    Source source
    int quantity
    Double unitPrice

    static constraints = {
    }

    static belongsTo = [ order : Order ]

}
