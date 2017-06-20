/**
 * @file getters
 * Created by haner on 2017/3/27.
 */

export default {
    
    completedProjects: state => {
    return state.projects.filter(project => project.completed).length
    }
}
