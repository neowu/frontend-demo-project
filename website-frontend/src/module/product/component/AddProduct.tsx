import {Button, Form, Radio} from "antd";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import {RootState} from "type/state";

interface StateProps {
    ui: {
        types: Array<{
            name: string;
            value: string;
        }>;
        now: Date | null;
    };
}

interface Props extends StateProps, DispatchProp {}

const AddProduct: React.FunctionComponent<Props> = ({ui}: Props) => {
    const onFinish = (values: {[name: string]: string}) => {
        // console.info(values);
    };

    return (
        <div>
            <h1>{ui.now == null ? "" : ui.now.toDateString()}</h1>
            <Form onFinish={onFinish}>
                <Form.Item name="type">
                    <Radio.Group>
                        {ui.types.map(type => (
                            <Radio.Button key={type.value} value={type.value}>
                                {type.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const mapStateToProps = (state: RootState): StateProps => {
    return {
        ui: state.app.product.createProductUI,
    };
};

export default connect(mapStateToProps)(AddProduct);
