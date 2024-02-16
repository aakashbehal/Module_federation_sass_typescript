import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Modal, Container, Row, Col, Button, Form } from "react-bootstrap"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FixedSizeList, areEqual } from "react-window";
import { useDispatch, useSelector } from 'react-redux';
import { DashboardActionCreator } from '../../store/actions/dashboard.actions';
import { useToasts } from 'react-toast-notifications';
import { createMessage } from '../../helpers/messages';

function reorderList(list: any, startIndex: any, endIndex: any) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

function getStyle({ draggableStyle, virtualStyle, isDragging }: any) {
    // If you don't want any spacing between your items
    // then you could just return this.
    // I do a little bit of magic to have some nice visual space
    // between the row items
    const combined = {
        ...virtualStyle,
        ...draggableStyle
    };

    // Being lazy: this is defined in our css file
    const grid = 8;

    // when dragging we want to use the draggable style for placement, otherwise use the virtual style
    const result = {
        ...combined,
        height: isDragging ? combined.height : combined.height - grid,
        left: isDragging ? combined.left : combined.left + grid,
        width: isDragging
            ? draggableStyle.width
            : `calc(${combined.width} - ${grid * 2}px)`,
        marginBottom: grid
    };

    return result;
}

function Item({ provided, item, style, isDragging }: any) {
    return (
        <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={getStyle({
                draggableStyle: provided.draggableProps.style,
                virtualStyle: style,
                isDragging
            })}
            className={`item ${isDragging ? "is-dragging" : ""}`}
        >
            {item.fullName}
        </div>
    );
}

// Recommended react-window performance optimization: memoize the row render function
const RowLocal = React.memo(function Row(props: any) {
    const { data: items, index, style } = props;
    const item = items[index];

    // We are rendering an extra item for the placeholder
    if (!item) {
        return null;
    }

    return (
        <Draggable draggableId={`id:${item.widgetId}`} index={index} key={item.widgetId}>
            {(provided: any) => <Item provided={provided} item={item} style={style} />}
        </Draggable>
    );
}, areEqual);

const ItemList = React.memo(function ItemList({ column, index }: any) {
    // There is an issue I have noticed with react-window that when reordered
    // react-window sets the scroll back to 0 but does not update the UI
    // I should raise an issue for this.
    // As a work around I am resetting the scroll to 0
    // on any list that changes it's index
    const listRef = useRef<any>();
    useLayoutEffect(() => {
        const list = listRef.current;
        if (list) {
            list.scrollTo(0);
        }
    }, [index]);

    return (
        <Droppable
            droppableId={column.id}
            mode="virtual"
            renderClone={(provided: any, snapshot: any, rubric: any) => (
                <Item
                    provided={provided}
                    isDragging={snapshot.isDragging}
                    item={column.items[rubric.source.index]}
                />
            )}
        >
            {(provided: any, snapshot: any) => {
                // Add an extra item to our list to make space for a dragging item
                // Usually the DroppableProvided.placeholder does this, but that won't
                // work in a virtual list
                const itemCount = snapshot.isUsingPlaceholder
                    ? column.items.length + 1
                    : column.items.length;

                return (
                    <FixedSizeList
                        height={500}
                        itemCount={itemCount}
                        itemSize={60}
                        width={300}
                        outerRef={provided.innerRef}
                        itemData={column.items}
                        className="task-list"
                        ref={listRef}
                    >
                        {RowLocal}
                    </FixedSizeList>
                );
            }}
        </Droppable>
    );
});

const Column = React.memo(function Column({ column, index }: any) {
    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided: any) => (
                <div
                    className="column"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <h3 className="column-title" {...provided.dragHandleProps}>
                        {column.title}
                    </h3>
                    <ItemList column={column} index={index} />
                </div>
            )}
        </Draggable>
    );
});

const MoveWidgets = (props: any) => {

    const { addToast } = useToasts();
    const dispatch = useDispatch()
    const [state, setState] = useState<any>();

    const { widgets, errorPreference, successPreference } = useSelector((state: any) => ({
        widgets: state?.collect?.dashboard?.widgetList,
        errorPreference: state?.collect?.dashboard?.errorPreference,
        successPreference: state?.collect?.dashboard?.successPreference
    }))

    useEffect(() => {
        dispatch(DashboardActionCreator.userWidgetList())
    }, [])

    useEffect(() => {
        if (widgets?.addedWidgetList) {
            const data = {
                columns: {
                    "addedWidgetList": {
                        id: "addedWidgetList",
                        title: "Selected",
                        items: widgets.addedWidgetList
                    },
                    "permittedOtherWidgetList": {
                        id: "permittedOtherWidgetList",
                        title: "Available",
                        items: widgets.permittedOtherWidgetList
                    }
                },
                columnOrder: ["addedWidgetList", "permittedOtherWidgetList"]
            }
            setState(data)
        }
    }, [widgets])

    useEffect(() => {
        if (errorPreference) {
            addToast(createMessage('error', `saving`, 'dashboard preference'), { appearance: 'error', autoDismiss: false })
        }
        if (successPreference) {
            addToast(createMessage('success', `saved`, 'Dashboard preference'), { appearance: 'success', autoDismiss: true })
        }
    }, [errorPreference, successPreference])

    function onDragEnd(result: any) {
        if (!result.destination) {
            return;
        }

        if (result.type === "column") {
            // if the list is scrolled it looks like there is some strangeness going on
            // with react-window. It looks to be scrolling back to scroll: 0
            // I should log an issue with the project
            const columnOrder = reorderList(
                state.columnOrder,
                result.source.index,
                result.destination.index
            );
            setState({
                ...state,
                columnOrder
            });
            return;
        }

        // reordering in same list
        if (result.source.droppableId === result.destination.droppableId) {
            const column = state.columns[result.source.droppableId];
            const items = reorderList(
                column.items,
                result.source.index,
                result.destination.index
            );

            // updating column entry
            const newState = {
                ...state,
                columns: {
                    ...state.columns,
                    [column.id]: {
                        ...column,
                        items
                    }
                }
            };
            setState(newState);
            return;
        }

        // moving between lists
        const sourceColumn = state.columns[result.source.droppableId];
        const destinationColumn = state.columns[result.destination.droppableId];
        const item = sourceColumn.items[result.source.index];

        // 1. remove item from source column
        const newSourceColumn = {
            ...sourceColumn,
            items: [...sourceColumn.items]
        };
        newSourceColumn.items.splice(result.source.index, 1);

        // 2. insert into destination column
        const newDestinationColumn = {
            ...destinationColumn,
            items: [...destinationColumn.items]
        };
        // in line modification of items
        newDestinationColumn.items.splice(result.destination.index, 0, item);

        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [newSourceColumn.id]: newSourceColumn,
                [newDestinationColumn.id]: newDestinationColumn
            }
        };

        setState(newState);
    }

    const save = () => {
        const addedList = state.columns.addedWidgetList.items.map((widget: any) => {
            return {
                "widgetId": widget.widgetId,
                "leftPoint": widget.x,
                "topPoint": widget.y,
                "height": widget.h,
                "width": widget.w
            }
        })
        dispatch(DashboardActionCreator.savePreference(addedList))
    }

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit dashboard
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Row>
                        <Col xs={12} md={12}>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <div className="app_move">
                                    <Droppable
                                        droppableId="all-droppables"
                                        direction="horizontal"
                                        type="column"
                                    >
                                        {(provided: any) => (
                                            <div
                                                className="columns"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {state?.columnOrder?.map((columnId: any, index: any) => (
                                                    <Column
                                                        key={columnId}
                                                        column={state.columns[columnId]}
                                                        index={index}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </DragDropContext>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='dark' onClick={props.onHide}>Close</Button>
                <Button variant='dark' onClick={save}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default MoveWidgets
