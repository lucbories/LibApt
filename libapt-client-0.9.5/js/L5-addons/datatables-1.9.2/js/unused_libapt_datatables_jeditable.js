

/*
	APT - DATATABLES - JEDITABLE EVENT
	ON CREATING
*/
function apt_datatable_on_creating(tr, id)
{
	var box = $('#apt_msg_box');
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.append('<p>Record creating (' + id + ')</p>');
	box.append('<a href="" class="close">&times;</a>');
	return true;
};

/*
	APT - DATATABLES - JEDITABLE EVENT
	ON CREATED
*/
function apt_datatable_on_created(status)
{
	var box = $('#apt_msg_box_success');
	if (status == 'failure')
	{
		box = $('#apt_msg_box_alert');
	}
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.append('<p>Record created (' + status + ')</p>');
	box.append('<a href="" class="close">&times;</a>');
};

/*
	APT - DATATABLES - JEDITABLE EVENT
	ON DELETING
*/
function apt_datatable_on_deleting(tr, id)
{
	var box = $('#apt_msg_box');
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.append('<p>Record deleting (' + id + ')</p>');
	box.append('<a href="" class="close">&times;</a>');
	return true;
};

/*
	APT - DATATABLES - JEDITABLE EVENT
	ON DELETED
*/
function apt_datatable_on_deleted(status)
{
	var box = $('#apt_msg_box_success');
	if (status == 'failure')
	{
		box = $('#apt_msg_box_alert');
	}
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.append('<p>Record deleted (' + status + ')</p>');
	box.append('<a href="" class="close">&times;</a>');
};

/*
	APT - DATATABLES - JEDITABLE EVENT
	ON UPDATING
*/
function apt_datatable_on_updating(tr, id)
{
	var box = $('#apt_msg_box');
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.append('<p>Record updating (' + id + ')</p>');
	box.append('<a href="" class="close">&times;</a>');
	return true;
};

/*
	APT - DATATABLES - JEDITABLE EVENT
	ON UPDATED
*/
function apt_datatable_on_updated(status)
{
	var box = $('#apt_msg_box_success');
	if (status == 'failure')
	{
		box = $('#apt_msg_box_alert');
	}
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.append('<p>Record updated (' + status + ')</p>');
	box.append('<a href="" class="close">&times;</a>');
};


/*
	APT - DATATABLES - JEDITABLE
	INIT DATATABLE
*/
function apt_datatable_jeditable_init(arg_html_table_id)
{
	var table_id = '#' + arg_html_table_id;
	
	var oTable = $(table_id).dataTable();
	oTable.makeEditable(
			{
				// EVENTS
				fnOnDeleting: apt_datatable_on_deleting,
				fnOnDeleted:  apt_datatable_on_deleted,
				fnOnAdding:   apt_datatable_on_creating,
				fnOnAdded:    apt_datatable_on_created,
				fnOnEditing:  apt_datatable_on_updating,
				fnOnEdited:   apt_datatable_on_updated
			}
		);
	
};