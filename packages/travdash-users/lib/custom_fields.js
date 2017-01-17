import Users from 'meteor/nova:users';

// check if user can edit a user
const canEdit = Users.canEdit;

// check if user can create a new user
const canInsert = user => Users.canDo(user, "users.new");

// check if user can edit *all* users
const canEditAll = user => Users.canDo(user, "users.edit.all");


Users.addField(
  {
    fieldName: 'from',
    fieldSchema: {
      type: String,
      optional: true,
      control: "text",
      insertableIf: canInsert,
      editableIf: canEdit
    }
  },
);

Users.addField(
  {
    fieldName: 'lives',
    fieldSchema: {
      type: String,
      optional: true,
      control: "text",
      insertableIf: canInsert,
      editableIf: canEdit
    }
  }
);

Users.addField(
  {
    fieldName: 'went',
    fieldSchema: {
      type: String,
      optional: true,
      control: "text",
      insertableIf: canInsert,
      editableIf: canEdit
    }
  }
);
