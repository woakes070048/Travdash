import Users from 'meteor/nova:users';

// check if user can edit a user
const canEdit = Users.canEdit;

// check if user can create a new user
const canInsert = user => Users.canDo(user, "users.new");

// check if user can edit *all* users
const canEditAll = user => Users.canDo(user, "users.edit.all");

Users.addField(
  {
    fieldName: 'telescope.tripCount',
    fieldSchema: {
      type: Number,
      publish: true,
      optional: true
    }
  },
);

Users.addField(
  {
    fieldName: 'telescope.from',
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
    fieldName: 'telescope.lives',
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
    fieldName: 'telescope.went',
    fieldSchema: {
      type: String,
      optional: true,
      control: "text",
      insertableIf: canInsert,
      editableIf: canEdit
    }
  }
);
