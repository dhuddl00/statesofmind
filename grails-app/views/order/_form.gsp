<%@ page import="com.statesofmind.Order" %>



<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'plannedCompleteDate', 'error')} ">
	<label for="plannedCompleteDate">
		<g:message code="order.plannedCompleteDate.label" default="Planned Complete Date" />
		
	</label>
	<g:datePicker name="plannedCompleteDate" precision="day"  value="${orderInstance?.plannedCompleteDate}" default="none" noSelection="['': '']" />
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'actualCompleteDate', 'error')} ">
	<label for="actualCompleteDate">
		<g:message code="order.actualCompleteDate.label" default="Actual Complete Date" />
		
	</label>
	<g:datePicker name="actualCompleteDate" precision="day"  value="${orderInstance?.actualCompleteDate}" default="none" noSelection="['': '']" />
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'amount', 'error')} required">
	<label for="amount">
		<g:message code="order.amount.label" default="Amount" />
		<span class="required-indicator">*</span>
	</label>
	<g:field name="amount" value="${fieldValue(bean: orderInstance, field: 'amount')}" required=""/>
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'blanksOrdered', 'error')} ">
	<label for="blanksOrdered">
		<g:message code="order.blanksOrdered.label" default="Blanks Ordered" />
		
	</label>
	<g:checkBox name="blanksOrdered" value="${orderInstance?.blanksOrdered}" />
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'client', 'error')} required">
	<label for="client">
		<g:message code="order.client.label" default="Client" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="client" name="client.id" from="${com.statesofmind.Client.list()}" optionKey="id" required="" value="${orderInstance?.client?.id}" class="many-to-one"/>
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'desc', 'error')} ">
	<label for="desc">
		<g:message code="order.desc.label" default="Desc" />
		
	</label>
	<g:textField name="desc" value="${orderInstance?.desc}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'expenses', 'error')} ">
	<label for="expenses">
		<g:message code="order.expenses.label" default="Expenses" />
		
	</label>
	
<ul class="one-to-many">
<g:each in="${orderInstance?.expenses?}" var="e">
    <li><g:link controller="orderExpense" action="show" id="${e.id}">${e?.encodeAsHTML()}</g:link></li>
</g:each>
<li class="add">
<g:link controller="orderExpense" action="create" params="['order.id': orderInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'orderExpense.label', default: 'OrderExpense')])}</g:link>
</li>
</ul>

</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'notes', 'error')} ">
	<label for="notes">
		<g:message code="order.notes.label" default="Notes" />
		
	</label>
	<g:textField name="notes" value="${orderInstance?.notes}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'numOfDesigns', 'error')} required">
	<label for="numOfDesigns">
		<g:message code="order.numOfDesigns.label" default="Num Of Designs" />
		<span class="required-indicator">*</span>
	</label>
	<g:field name="numOfDesigns" type="number" value="${orderInstance.numOfDesigns}" required=""/>
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'orderDate', 'error')} required">
	<label for="orderDate">
		<g:message code="order.orderDate.label" default="Order Date" />
		<span class="required-indicator">*</span>
	</label>
	<g:datePicker name="orderDate" precision="day"  value="${orderInstance?.orderDate}"  />
</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'payments', 'error')} ">
	<label for="payments">
		<g:message code="order.payments.label" default="Payments" />
		
	</label>
	
<ul class="one-to-many">
<g:each in="${orderInstance?.payments?}" var="p">
    <li><g:link controller="orderPayment" action="show" id="${p.id}">${p?.encodeAsHTML()}</g:link></li>
</g:each>
<li class="add">
<g:link controller="orderPayment" action="create" params="['order.id': orderInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'orderPayment.label', default: 'OrderPayment')])}</g:link>
</li>
</ul>

</div>

<div class="fieldcontain ${hasErrors(bean: orderInstance, field: 'sentToPrinter', 'error')} ">
	<label for="sentToPrinter">
		<g:message code="order.sentToPrinter.label" default="Sent To Printer" />
		
	</label>
	<g:checkBox name="sentToPrinter" value="${orderInstance?.sentToPrinter}" />
</div>

