import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    ImageBackground,
    Alert,
    FlatList,
    TouchableOpacity,
    Linking,
    Image
} from "react-native";
import axios from "axios";
import { withSafeAreaInsets } from "react-native-safe-area-context";

export default class UpdateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            reports: [],
            blogs: []
        };
    }

    componentDidMount() {
        this.getArticles()
    }

    
    getArticles = () => {
        axios
            .get("https://api.spaceflightnewsapi.net/v3/articles")
            .then(response => {
                this.setState({ articles: response.data })
                this.getReports()
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    getReports = () => { 
        axios
            .get("https://api.spaceflightnewsapi.net/v3/reports")
            .then(response => {
                this.setState({ reports: response.data })
                this.getBlogs()
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    getBlogs = () => {
        axios
            .get("https://api.spaceflightnewsapi.net/v3/blogs")
            .then(response => {
                this.setState({ blogs: response.data })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    renderItem = ({ item }) => {
        let width = 50;
        let url;
        if (item.type == "Report") {
            url = require("../assets/iss_icon.png")
        } else {
            url = require("../assets/blog_icon.png")
        }
        if (item.type == "Article") {
            console.log(item.featured_image)
            return (
                <TouchableOpacity style={styles.listContainer}
                    onPress={() => Linking.openURL(item.url).catch(err => console.error("Couldn't load page", err))}
                >
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.iconContainer}>
                        <Image source={{ "uri": item.featured_image }} style={{ width: "100%", height: 100 }}></Image>
                    </View>
                </TouchableOpacity >
            );
        } else {
            return (
                <TouchableOpacity style={styles.listContainer}
                    onPress={() => Linking.openURL(item.url).catch(err => console.error("Couldn't load page", err))}
                >
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.iconContainer}>
                        <Image source={url} style={{ width: width, height: width }}></Image>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    keyExtractor = (item, index) => index.toString();

    addFlag = (arr, value) => {
        for (let i = 0; i < arr.length; i++) {
            console.log(arr[i])
            arr[i].type = value
        }
        return arr
    }

    render() {
        let articles = this.addFlag(this.state.articles, "Article")
        let reports = this.addFlag(this.state.reports, "Report")
        let blogs = this.addFlag(this.state.blogs, "Blog")
        let events = articles.concat(reports).concat(blogs)
        events = events.sort(function (a, b) {
            return new Date(b.published_date) - new Date(a.published_date);
        });
        if (events.length == 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <ImageBackground source={require('../assets/bg.png')} style={styles.backgroundImage}>
                        <View style={styles.titleBar}>
                            <Text style={styles.titleText}>Updates</Text>
                        </View>
                        <View style={styles.eventContainer}>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={events}
                                renderItem={this.renderItem}
                            />
                        </View>
                    </ImageBackground>
                </View >
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    titleBar: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    eventContainer: {
        flex: 0.85
    },
    listContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 10,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        padding: 10
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 20
    }
});
