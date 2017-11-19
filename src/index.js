import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import fs from 'fs';
import os from 'os';

const tmpdir = os.tmpdir();

const style = {
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'magenta'
    }
  }
};

class Tasks extends Component {
  constructor() {
    super();
    this.state = { tasks: [] }
  }

  sync() {
    const path = `${tmpdir}/tasks.json`
    const defaultTasks = {
      tasks: [ 'Add a task!', 'Click to finish task!' ]
    }

    if (fs.existsSync(`${tmpdir}/tasks.json`)) {
      const rawTasks = fs.readFileSync(`${tmpdir}/tasks.json`)
      return JSON.parse(rawTasks.toString())
    } else {
      fs.writeFileSync(path, JSON.stringify(defaultTasks))
      return defaultTasks
    }
  }

  componentDidMount() {
    const { tasks } = this.sync();
    this.setState({ tasks });
  }

  save(tasks) {
    const path = `${tmpdir}/tasks.json`
    fs.writeFileSync(path, JSON.stringify(tasks))
  }

  selectTask(task) {
    const { tasks } = this.state;

    const DIM = "\x1b[2m"
    const RESET = "\u001b[0m"
    const UNDERSCORE = "\x1b[4m"
    console.log(`\n${DIM}FINISHED: ${UNDERSCORE}"${task.content}${RESET}`)

    const index = tasks.indexOf(task.content)
    if (index >= 0) {
      tasks.splice(index, 1)
      this.setState({ tasks })
      this.save({ tasks })
    }
  }

  render() {
    const { tasks } = this.state;

    return (
      <box
        clickable={ true }
        top="center"
        left="center"
        label={`• ${new Date().toDateString()} •`}
        class={style}
        width="70%"
        height="70%"
        mouse={ true }
        keys={ true }
        draggable={true}>
        <box class={style}>
          <list
            label="TASKS"
            class={{
              border: { type: 'line'},
              style: { border: { fg: 'blue' } },
            }}
            style={{
              item: { fg: 'magenta' },
              selected: { fg: 'white', bg: 'black' },
            }}
            mouse={ true }
            keys={ true }
            items={ tasks }
            onSelect={ this.selectTask.bind(this) }
            />
        </box>
      </box>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Tasks'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

render(<Tasks />, screen);
