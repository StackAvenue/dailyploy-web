<button
type="button"
disabled={this.props.loadStatus}
className={`button1 btn-primary pull-right ${
  props.state.taskloader && this.props.loadStatus ? "disabled" : ""
  }`}
onClick={() =>
  props.state.taskButton === "Add"
    ? props.addTask()
    : props.editTask()
}
disabled={this.props.state.isDisable}
>
{props.state.taskButton}
{this.props.state.taskloader? (
  <Loader
    type="Oval"
    color="#FFFFFF"
    height={20}
    width={20}
    style={{ paddingLeft: "5px" }}
    className="d-inline-block login-signup-loader"
  />
) : null}
</button>
{this.props.state.fromInfoEdit ? (
<button
  type="button"
  className="pull-right button3 btn-primary"
  onClick={() => props.confirmModal("delete")}
>
  Delete
</button>