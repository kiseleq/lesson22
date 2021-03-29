'use strict';

class ToDo {
    constructor(form, input, todoList, completedList) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.completedList = document.querySelector(completedList);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }


    deleteElem(closest) {
        this.todoData.forEach((item, todoKey, map) => {
            if (closest.key === todoKey) {
                map.delete(todoKey);
            }
        });
    }

    completedElem(closest) {
        this.todoData.forEach(item => {
            if (closest.key === item.key) {
                item.completed = !item.completed;
            }
        });
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');

        todoContainer.addEventListener('click', event => {
            let target = event.target,
                closest = target.closest('li');

            if (target.matches('.todo-remove')) {
                this.deleteElem(closest);
            } else if (target.matches('.todo-complete')) {
                this.completedElem(closest);
            }
            this.render();
        });
    }


    createItem(elem) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = elem.key;
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${elem.value}</span>
        <div class="todo-buttons">
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>
        `);

        if (elem.completed) {
            this.completedList.append(li);
        } else {
            this.todoList.append(li);
        }
        return li;
    }


    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.completedList.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }


    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            this.input.style.border = 'none';
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };
            this.input.value = '';
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else {
            this.input.style.border = '2px solid red';
            return;
        }

    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }

}
const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();