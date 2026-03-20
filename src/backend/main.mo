import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Option "mo:core/Option";

actor {
  type TaskId = Nat;
  type TaskDescription = Text;

  type Department = {
    #purchase;
    #marketing;
    #store;
  };

  module Department {
    public func toText(dept : Department) : Text {
      switch (dept) {
        case (#purchase) { "Purchase" };
        case (#marketing) { "Marketing" };
        case (#store) { "Store" };
      };
    };
  };

  type TaskMode = {
    #onSite;
    #online;
  };

  module TaskMode {
    public func toText(mode : TaskMode) : Text {
      switch (mode) {
        case (#onSite) { "On-site" };
        case (#online) { "Online" };
      };
    };
  };

  type TaskStatus = {
    #pending;
    #inProgress;
    #done;
  };

  module TaskStatus {
    public func toText(status : TaskStatus) : Text {
      switch (status) {
        case (#pending) { "Pending" };
        case (#inProgress) { "In Progress" };
        case (#done) { "Done" };
      };
    };
  };

  type Task = {
    id : TaskId;
    title : Text;
    description : TaskDescription;
    department : Department;
    mode : TaskMode;
    status : TaskStatus;
  };

  module Task {
    public func create(
      id : TaskId,
      title : Text,
      description : TaskDescription,
      department : Department,
      mode : TaskMode,
    ) : Task {
      {
        id;
        title;
        description;
        department;
        mode;
        status = #pending;
      };
    };
  };

  var tasksInMemory = [
    Task.create(
      1,
      "Purchase Supplies",
      "Buy office supplies",
      #purchase,
      #onSite,
    ),
    Task.create(
      2,
      "Online Research",
      "Research market trends",
      #marketing,
      #online,
    ),
    Task.create(
      3,
      "Store Inventory",
      "Manage store inventory",
      #store,
      #onSite,
    ),
  ];

  public query ({ caller }) func getTasks(departmentText : ?Text, modeText : ?Text) : async [Task] {
    let departmentFilter = mapBalloonTextToDepartment(departmentText);
    let modeFilter = mapBalloonTextToMode(modeText);
    tasksInMemory.filter(
      func(task) {
        let departmentMatches = switch (departmentFilter, task.department) {
          case (null, _) { true };
          case (?#purchase, #purchase) { true };
          case (?#marketing, #marketing) { true };
          case (?#store, #store) { true };
          case (_, _) { false };
        };
        let modeMatches = switch (modeFilter, task.mode) {
          case (null, _) { true };
          case (?#onSite, #onSite) { true };
          case (?#online, #online) { true };
          case (_, _) { false };
        };
        departmentMatches and modeMatches;
      }
    );
  };

  func mapBalloonTextToDepartment(deptText : ?Text) : ?Department {
    switch (deptText) {
      case (null) { null };
      case (?text) {
        if (text == "Purchase") { return ?#purchase };
        if (text == "Marketing") { return ?#marketing };
        if (text == "Store") { return ?#store };
        null;
      };
    };
  };

  func mapBalloonTextToMode(modeText : ?Text) : ?TaskMode {
    switch (modeText) {
      case (null) { null };
      case (?text) {
        if (text == "On-site") { return ?#onSite };
        if (text == "Online") { return ?#online };
        null;
      };
    };
  };

  public shared ({ caller }) func addTask(taskId : TaskId, title : Text, description : Text, departmentBalloon : Department, modeBalloon : TaskMode) : async () {
    let newTask = Task.create(taskId, title, description, departmentBalloon, modeBalloon);

    let existingTask = tasksInMemory.find(func(task) { task.id == taskId });
    switch (existingTask) {
      case (null) {
        tasksInMemory := tasksInMemory.concat([newTask]);
        ();
      };
      case (?_) {
        Runtime.trap("Task with this ID already exists.");
      };
    };
  };

  public shared ({ caller }) func updateTaskStatus(taskId : TaskId, newStatus : TaskStatus) : async () {
    let updatedTasks = tasksInMemory.map(
      func(task) {
        if (task.id == taskId) {
          {
            id = task.id;
            title = task.title;
            description = task.description;
            department = task.department;
            mode = task.mode;
            status = newStatus;
          };
        } else {
          task;
        };
      }
    );
    tasksInMemory := updatedTasks;
  };

  public shared ({ caller }) func deleteTask(taskId : TaskId) : async () {
    let existingTask = tasksInMemory.find(func(task) { task.id == taskId });
    switch (existingTask) {
      case (null) { Runtime.trap("Task not found") };
      case (?_) {
        tasksInMemory := tasksInMemory.filter(func(task) { task.id != taskId });
        ();
      };
    };
  };

  public query ({ caller }) func getDepartmentMap() : async [(Text, Department)] {
    [
      ("Purchase", #purchase),
      ("Marketing", #marketing),
      ("Store", #store),
    ];
  };

  public query ({ caller }) func getModeMap() : async [(Text, TaskMode)] {
    [
      ("On-site", #onSite),
      ("Online", #online),
    ];
  };

  public query ({ caller }) func getStatusMap() : async [(Text, TaskStatus)] {
    [
      ("Pending", #pending),
      ("In Progress", #inProgress),
      ("Done", #done),
    ];
  };
};
