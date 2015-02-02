var ACTIVEX_AXIS_CLASS_ID = "745395C8-D0E1-4227-8586-624CA9A10A8D";

var MODE_INITIAL = 'initial';
var MODE_ERROR = 'error';
var MODE_SHOW = 'show';

var Axis = React.createClass({
    propTypes: {
        userName: React.PropTypes.string.isRequired,
        password: React.PropTypes.string.isRequired,
        camIp: React.PropTypes.string.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    },

    getInitialState: function () {

        return {
            mode: MODE_INITIAL,
            errorMessage: ''
        };
    },

    componentDidMount: function () {
        var axNode = this.refs.axis.getDOMNode();

        var check = true;
        var errMessage = "";

        if ("object" in axNode) {
            try {
                axNode.Play();
                debugger;
                function test1(bStat) {
                    debugger;
                    console.log('test1');
                }
                eval("function axNode::OnStatusChange (bStat) {return test1 (bStat);}");

            } catch (e) {
                check = false;
                errMessage = e.message;
            }
        } else {
            check = false;
            errMessage = "No object";
        }

        if (check) {
            this.setState({
                mode: MODE_SHOW
            });
        } else {
            this.setState({
                mode: MODE_ERROR,
                errorMessage: errMessage
            });
        }
    },

    componentWillUnmount: function () {
        //todo проверить надо ли останавливать axNode.Stop() ?
    },

    render: function () {

        switch (this.state.mode) {
            case MODE_INITIAL:
            case MODE_SHOW:
                mainContent = (
                    <object
                        width = { this.props.width }
                        height = { this.props.height }
                        ref = "axis"
                        classID = { "clsid:" + ACTIVEX_AXIS_CLASS_ID }
                    >
                        <param
                            name = "AutoStart"
                            value = "0"
                        />
                        <param
                            name = "StretchToFit"
                            value = "1"
                        />
                        <param
                            name = "UIMode"
                            value = "none"
                        />
                        <param
                            name = "MediaType"
                            value = "mjpeg"
                        />
                        <param
                            name = "NetworkTimeout"
                            value = "35000"
                        />
                        <param
                            name="MediaUsername"
                            value = { this.props.userName }
                        />
                        <param
                            name="MediaPassword"
                            value = { this.props.password }
                        />
                        <param
                            name = "MediaURL"
                            value = { "http://" + this.props.camIp + "/axis-cgi/mjpg/video.cgi" }
                        />
                    </object>
                );
                break;
            case MODE_ERROR:
                mainContent = (
                    <div
                        style = {{
                            width: this.props.width,
                            height: this.props.height
                        }}
                    >
                        <p>
                            <b>Ошибка</b>
                        </p>
                        <p>{ this.state.errorMessage }</p>
                    </div>
                );
                break;
            default:
                throw new Error("Unknown mode.");
        }

        return (
            <div>{ mainContent }</div>
        )
    }
});