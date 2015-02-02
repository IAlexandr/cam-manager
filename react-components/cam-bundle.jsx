var CamBundle = React.createClass({
    render: function () {
        return (
            <div>
                <div
                    style = {{
                        border: "2px solid blue",
                        width: "480px",
                        height: "320px"
                    }}
                >
                    <Itv
                        serverIp = "10.157.199.15"
                        camId = "125"
                        width = "320px"
                        height = "240px"
                    />
                </div>
                <div
                    style = {{
                        border: "2px solid red",
                        width: "480px",
                        height: "320px"
                    }}
                >
                    <Axis
                        userName = "user"
                        password = "user21"
                        camIp = "10.157.197.133"
                        width = "320px"
                        height = "240px"
                    />
                </div>
                <div
                    style = {{
                        border: "2px solid green",
                        width: "480px",
                        height: "320px"
                    }}
                >
                    <Mobotix
                        userName = "user"
                        password = "user21"
                        camIp = "10.157.197.62"
                        width = "320px"
                        height = "240px"
                    />
                </div>
            </div>
        );
    }
});

React.renderComponent(
    <CamBundle />,
    document.body
);