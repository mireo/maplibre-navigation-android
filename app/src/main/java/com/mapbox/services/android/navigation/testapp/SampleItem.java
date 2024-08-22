package com.mapbox.services.android.navigation.testapp;

public class SampleItem {

  private final String name;
  private final String description;
  private final Class activity;

  public SampleItem(String name, String description, Class activity) {
    this.name = name;
    this.description = description;
    this.activity = activity;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public Class getActivity() {
    return activity;
  }

}
