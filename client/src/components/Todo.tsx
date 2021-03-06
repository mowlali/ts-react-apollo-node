import React from "react";
import {
  ListItem,
  Checkbox,
  ListItemText,
  createStyles,
  WithStyles,
  withStyles,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Todo as TodoType,
  UpdateTodoComponent,
  TodosQuery,
  TodosQueryVariables,
  TodosDocument,
  DestroyTodoComponent
} from "../generated/graphql";

const styles = createStyles({
  complete: {
    textDecoration: "line-through"
  }
});

interface Props extends WithStyles<typeof styles> {
  todo: TodoType;
}

const Todo = ({ classes, todo }: Props) => (
  <UpdateTodoComponent
    update={(cache, { data }) => {
      if (!data) {
        return;
      }
      const updateTodo = data.updateTodo;
      const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
        query: TodosDocument
      });
      if (query) {
        const { todos } = query;
        cache.writeQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument,
          data: {
            todos: todos.map(todo =>
              todo.id === updateTodo.id ? updateTodo : todo
            )
          }
        });
      }
    }}
  >
    {updateTodo => (
      <ListItem
        key={todo.id}
        role={undefined}
        dense
        button
        onClick={() =>
          updateTodo({ variables: { id: todo.id, complete: !todo.complete } })
        }
      >
        <Checkbox checked={todo.complete} tabIndex={-1} disableRipple />
        <ListItemText
          primary={todo.name}
          classes={todo.complete ? { primary: classes.complete } : undefined}
        />
        <ListItemSecondaryAction>
          <DestroyTodoComponent
            update={(cache, { data }) => {
              if (!data) {
                return;
              }
              const destroyTodo = data.destroyTodo;
              const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
                query: TodosDocument
              });
              if (query) {
                const { todos } = query;
                cache.writeQuery<TodosQuery, TodosQueryVariables>({
                  query: TodosDocument,
                  data: {
                    todos: todos.filter(todo => todo.id !== destroyTodo.id)
                  }
                });
              }
            }}
          >
            {destroyTodo => (
              <IconButton
                aria-label="Delete"
                onClick={() => destroyTodo({ variables: { id: todo.id } })}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </DestroyTodoComponent>
        </ListItemSecondaryAction>
      </ListItem>
    )}
  </UpdateTodoComponent>
);

export default withStyles(styles)(Todo);
